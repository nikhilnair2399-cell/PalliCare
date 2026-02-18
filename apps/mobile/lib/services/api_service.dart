import 'package:dio/dio.dart';
import '../core/constants/api_endpoints.dart';

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

  // ---- Prehab APIs ----

  Future<Response> getPrehabPathway(String patientId) =>
      _dio.get('/patients/$patientId/prehab/pathway');

  Future<Response> logExercise(Map<String, dynamic> log) =>
      _dio.post('/prehab/exercise-logs', data: log);

  Future<Response> logNutrition(Map<String, dynamic> log) =>
      _dio.post('/prehab/nutrition-logs', data: log);

  // ---- Report APIs ----

  Future<Response> generateReport(Map<String, dynamic> config) =>
      _dio.post('/reports/generate', data: config);

  // ---- Auth APIs ----

  Future<Response> sendOtp(String phone) =>
      _dio.post('/auth/otp/send', data: {'phone': phone});

  Future<Response> verifyOtp(String phone, String otp) =>
      _dio.post('/auth/otp/verify', data: {'phone': phone, 'otp': otp});

  // ---- Sync APIs ----

  Future<Response> syncEntries(List<Map<String, dynamic>> entries) =>
      _dio.post('/sync/batch', data: {'entries': entries});
}

class _AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    // Token is already set in headers via setAuthToken
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Token expired — trigger re-auth flow
      // TODO: Refresh token or redirect to login
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
