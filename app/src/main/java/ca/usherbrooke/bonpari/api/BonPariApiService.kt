package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET

private const val BASE_URL = "http://10.0.2.2:3000/"

private val moshi = Moshi.Builder()
    .add(KotlinJsonAdapterFactory())
    .build()

private val retrofit = Retrofit.Builder()
    .addConverterFactory(MoshiConverterFactory.create(moshi))
    .baseUrl(BASE_URL)
    .build()

interface BonPariApiService {
    @GET("parties")
    suspend fun getAllGames() : List<Match>
}

object BonPariApi {
    val retrofitService : BonPariApiService by lazy {
        retrofit.create(BonPariApiService::class.java) }
}