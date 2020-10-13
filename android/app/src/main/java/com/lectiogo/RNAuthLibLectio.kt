package com.lectiogo

import com.facebook.react.bridge.*
import com.facebook.react.bridge.Callback
import com.franmontiel.persistentcookiejar.ClearableCookieJar
import com.franmontiel.persistentcookiejar.PersistentCookieJar
import com.franmontiel.persistentcookiejar.cache.SetCookieCache
import com.franmontiel.persistentcookiejar.persistence.SharedPrefsCookiePersistor
import okhttp3.*
import java.io.IOException


class RNLectioRequest(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "RNLectioRequest"
    }

    val cookieJar: ClearableCookieJar = PersistentCookieJar(SetCookieCache(), SharedPrefsCookiePersistor(MainApplication.getAppContext()))
    val client = OkHttpClient.Builder()
            .cookieJar(cookieJar)
            .build()

    @ReactMethod
    fun PostLectio(url: String, body: ReadableMap, callback: Callback) {
        val formBody: FormBody = getFromBodyFromMap(body);

        val request = Request.Builder()
                .url(url)
                .post(formBody)
                .build()

        try {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) callback.invoke(null, null, "errorcode  $response")
                val responseText: String = response.body()!!.string();
                var headersMap = WritableNativeMap();

                response.headers().toMultimap().map { it ->
                    headersMap.putString(it.key, it.value.toString())
                }

                callback.invoke(responseText, headersMap, "success");
            }
        } catch (error: Exception) {
            callback.invoke(null, null, "${error.message}")
        }
    }

    @ReactMethod
    fun GetLectio(url: String, callback: Callback) {
        val request = Request.Builder()
                .url(url)
                .build()

        try {
            client.newCall(request).execute().use { response ->
                if (!response.isSuccessful) callback.invoke(null, null, "errorcode  $response")
                val responseText: String = response.body()!!.string();
                var headersMap = WritableNativeMap();

                response.headers().toMultimap().map { it ->
                    headersMap.putString(it.key, it.value[0])
                }

                callback.invoke(responseText, headersMap, "success");
            }
        } catch (error: Exception) {
            callback.invoke(null, null, "${error.message}")
        }


    }

    private fun getFromBodyFromMap(body: ReadableMap): FormBody {
        val formBody: FormBody.Builder = FormBody.Builder();

        body.entryIterator.forEach { it ->
            formBody.add(it.key, it.value.toString())
        }

        return formBody.build();
    }

}