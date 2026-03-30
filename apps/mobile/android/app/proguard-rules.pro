## Flutter wrapper
-keep class io.flutter.app.** { *; }
-keep class io.flutter.plugin.** { *; }
-keep class io.flutter.util.** { *; }
-keep class io.flutter.view.** { *; }
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }

## Firebase
-keep class com.google.firebase.** { *; }

## Hive
-keep class * extends com.google.protobuf.GeneratedMessageLite { *; }

## flutter_secure_storage
-keep class com.it_nomads.fluttersecurestorage.** { *; }

## Dio / OkHttp
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**

## Prevent R8 from stripping interface information
-keep,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

## Keep generic signatures (needed for Gson/Retrofit)
-keepattributes Signature
-keepattributes *Annotation*
