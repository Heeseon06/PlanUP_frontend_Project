# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# -keep class com.yourapp.** { *; }
-keep class com.facebook.fresco.** { *; }
-keep class com.facebook.imagepipeline.** { *; }
-keep class com.facebook.imagepipeline.animated.base.AbstractAnimatedDrawable { *; }
-keep class com.facebook.imagepipeline.animated.base.AnimatedDrawableCachingBackend { *; }
-keep class com.facebook.imagepipeline.animated.base.AnimatedDrawableDiagnostics { *; }
-keep class com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory { *; }
-keep class com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl { *; }
-keep class com.facebook.imagepipeline.animated.impl.AnimatedDrawableCachingBackendImpl { *; }
-keep class com.facebook.imagepipeline.animated.impl.AnimatedDrawableCachingBackendImplProvider { *; }
-keep class com.facebook.imagepipeline.animated.impl.AnimatedDrawableDiagnosticsImpl { *; }
-keep class com.facebook.imagepipeline.animated.impl.AnimatedDrawableDiagnosticsNoop { *; }
-keep class com.facebook.imagepipeline.cache.AnimatedCache { *; }
-keep class com.facebook.imagepipeline.cache.AnimationFrames { *; }

# Suppress warnings for missing classes
-dontwarn com.facebook.imagepipeline.animated.base.AbstractAnimatedDrawable
-dontwarn com.facebook.imagepipeline.animated.base.AnimatedDrawableCachingBackend
-dontwarn com.facebook.imagepipeline.animated.base.AnimatedDrawableDiagnostics
-dontwarn com.facebook.imagepipeline.animated.factory.AnimatedDrawableFactory
-dontwarn com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl
-dontwarn com.facebook.imagepipeline.animated.impl.AnimatedDrawableCachingBackendImpl
-dontwarn com.facebook.imagepipeline.animated.impl.AnimatedDrawableCachingBackendImplProvider
-dontwarn com.facebook.imagepipeline.animated.impl.AnimatedDrawableDiagnosticsImpl
-dontwarn com.facebook.imagepipeline.animated.impl.AnimatedDrawableDiagnosticsNoop
-dontwarn com.facebook.imagepipeline.cache.AnimatedCache
-dontwarn com.facebook.imagepipeline.cache.AnimationFrames
