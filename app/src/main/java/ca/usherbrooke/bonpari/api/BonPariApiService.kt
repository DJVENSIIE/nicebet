package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

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
    @GET("parties/{id}")
    suspend fun getGame(@Path("id") id: Int) : Match?
    @POST("parties/parier")
    suspend fun bet(@Body body: BetBody) : BetResult
}

object BonPariApi {
    val retrofitService : BonPariApiService by lazy {
        retrofit.create(BonPariApiService::class.java) }
}