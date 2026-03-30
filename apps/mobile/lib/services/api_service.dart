import 'package:dio/dio.dart';
import '../core/constants/api_endpoints.dart';
import 'secure_storage_service.dart';

/// Central API client for PalliCare mobile app.
/// Uses Dio with interceptors for auth, error handling, and retry.
class ApiService {
  static ApiService? _instance;
  late final Dio _dio;

  ApiService._() {
    _dio = Dio(BaseOptions(
      baseUrl: ApiEndpoints.baseUrl,
      connectTimeout: const Duration(seconds: 15),
      receiveTimeout: const Duration(seconds: 15),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    _dio.interceptors.addAll([
      _AuthInterceptor(),
      _ErrorInterceptor(),
      LogInterceptor(
        requestBody: true,
        responseBody: true,
        logPrint: (obj) {}, // Silent in production
      ),
    ]);
  }

  factory ApiService() => _instance ??= ApiService._();

  Dio get dio => _dio;

  /// Set the auth token after login.
  void setAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  /// Remove auth token on logout.
  void clearAuthToken() {
    _dio.options.headers.remove('Authorization');
  }

  // ---- Patient APIs ----

  Future<Response> getPatientProfile(String patientId) =>
      _dio.get('/patients/$patientId');

  Future<Response> updatePatientProfile(
          String patientId, Map<String, dynamic> data) =>
      _dio.patch('/patients/$patientId', data: data);

  // ---- Symptom Log APIs ----

  Future<Response> createSymptomLog(Map<String, dynamic> log) =>
      _dio.post('/symptom-logs', data: log);

  Future<Response> getSymptomLogs(String patientId,
          {String? startDate, String? endDate, int limit = 50}) =>
      _dio.get('/patients/$patientId/symptom-logs', queryParameters: {
        if (startDate != null) 'start_date': startDate,
        if (endDate != null) 'end_date': endDate,
        'limit': limit,
      });

  // ---- Medication APIs ----

  Future<Response> getMedications(String patientId) =>
      _dio.get('/patients/$patientId/medications');

  Future<Response> logMedicationDose(Map<String, dynamic> log) =>
      _dio.post('/medication-logs', data: log);

  Future<Response> getMedicationLogs(String patientId,
          {String? date, int limit = 50}) =>
      _dio.get('/patients/$patientId/medication-logs', queryParameters: {
        if (date != null) 'date': date,
        'limit': limit,
      });

  // ---- Report APIs ----

  Future<Response> generateReport(Map<String, dynamic> config) =>
      _dio.post('/reports/generate', data: config);

  // ---- Auth APIs ----

  Future<Response> sendOtp(String phone) =>
      _dio.post('/auth/otp/send', data: {'phone': phone});

  Future<Response> verifyOtp(String phone, String otp) =>
      _dio.post('/auth/otp/verify', data: {'phone': phone, 'otp': otp});

  // ---- Sync APIs ----

  /// Sync offline records to server.
  /// Format matches NestJS POST /sync: { device_id, records[] }
  Future<Response> syncEntries(List<Map<String, dynamic>> records) =>
      _dio.post('/sync', data: {
        'device_id': records.isNotEmpty ? records.first['device_id'] : '',
        'records': records,
      });

  // ---- Feedback APIs ----

  Future<Response> submitFeedback(Map<String, dynamic> feedback) =>
      _dio.post('/feedback', data: feedback);

  // ---- Consent APIs (DPDPA 2023) ----

  /// Get the user's currently active consents.
  Future<Response> getActiveConsents() =>
      _dio.get('/consent');

  /// Get all consents including revoked ones.
  Future<Response> getAllConsents() =>
      _dio.get('/consent/all');

  /// Grant a new consent or update an existing one.
  Future<Response> grantConsent(Map<String, dynamic> consent) =>
      _dio.post('/consent', data: consent);

  /// Revoke a consent by type (e.g., 'data_sharing', 'analytics').
  Future<Response> revokeConsent(String consentType) =>
      _dio.delete('/consent/$consentType');

  /// Get the audit history for a specific consent type.
  Future<Response> getConsentHistory(String consentType) =>
      _dio.get('/consent/$consentType/history');

  // ---- Data Portability (DPDPA Section 18) ----

  /// Request an export of the user's data.
  Future<Response> requestDataExport({
    String type = 'full',
    String format = 'json',
  }) =>
      _dio.post('/data-portability/export', data: {
        'export_type': type,
        'format': format,
      });

  /// List all pending and completed data exports.
  Future<Response> getDataExports() =>
      _dio.get('/data-portability/exports');

  // ---- Data Deletion (DPDPA Section 12) ----

  /// Request deletion of the user's data.
  Future<Response> requestDataDeletion({String type = 'full_erasure'}) =>
      _dio.post('/data-deletion/request', data: {
        'request_type': type,
      });

  /// List all data deletion requests.
  Future<Response> getDataDeletionRequests() =>
      _dio.get('/data-deletion/requests');
}

/// Reads the access token from [SecureStorageService] on every request
/// instead of relying on a pre-set header.  This ensures that even if
/// the token is refreshed mid-session, subsequent requests automatically
/// pick up the new value.
///
/// On 401, attempts a single token refresh using the stored refresh token.
/// If refresh succeeds, retries the original request with the new token.
/// If refresh fails, clears tokens (forces re-login on next app interaction).
class _AuthInterceptor extends Interceptor {
  final SecureStorageService _secureStorage = SecureStorageService();
  bool _isRefreshing = false;

  @override
  void onRequest(
      RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _secureStorage.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401 &&
        !_isRefreshing &&
        !err.requestOptions.path.contains('/auth/')) {
      _isRefreshing = true;
      try {
        final refreshToken = await _secureStorage.getRefreshToken();
        if (refreshToken == null) {
          await _secureStorage.clearTokens();
          handler.next(err);
          return;
        }

        // Call refresh endpoint with a fresh Dio instance to avoid interceptor loop
        final refreshDio = Dio(BaseOptions(
          baseUrl: ApiEndpoints.baseUrl,
          headers: {'Content-Type': 'application/json'},
        ));

        final response = await refreshDio.post(
          '/auth/token/refresh',
          data: {'refresh_token': refreshToken},
        );

        final newAccessToken = response.data['access_token'] as String?;
        final newRefreshToken = response.data['refresh_token'] as String?;

        if (newAccessToken != null) {
          await _secureStorage.setAccessToken(newAccessToken);
          if (newRefreshToken != null) {
            await _secureStorage.setRefreshToken(newRefreshToken);
          }

          // Retry the original request with the new token
          final retryOptions = err.requestOptions;
          retryOptions.headers['Authorization'] = 'Bearer $newAccessToken';
          final retryResponse = await refreshDio.fetch(retryOptions);
          handler.resolve(retryResponse);
          return;
        }
      } catch (_) {
        // Refresh failed — clear tokens, user must re-login
        await _secureStorage.clearTokens();
      } finally {
        _isRefreshing = false;
      }
    }
    handler.next(err);
  }
}

class _ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    // Centralized error mapping
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        handler.next(DioException(
          requestOptions: err.requestOptions,
          error: 'Connection timed out. Please check your network.',
          type: err.type,
        ));
        break;
      case DioExceptionType.connectionError:
        handler.next(DioException(
          requestOptions: err.requestOptions,
          error: 'No internet connection.',
          type: err.type,
        ));
        break;
      default:
        handler.next(err);
    }
  }
}
