package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.GET
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
    suspend fun getGame(@Path("id") id: Int): Match?
}

object BonPariApi {
    val retrofitService : BonPariApiService by lazy {
        retrofit.create(BonPariApiService::class.java) }
}

object BonPariFakeApi {
    private val matches = mutableListOf<Match>()
    private var requestId: Int = 0

    private fun addMatch(match: Match) {
        matches.add(match)
    }

    private val AD = Player("Albert", "Damos", 28, 56, "Espagne")
    private val MR = Player("Milos", "Raonic", 28, 16, "Canada")
    private val AR = Player("Andy", "Roddick", 36, 1000, "États-Unis")
    private val AM = Player("Andy", "Murray", 28, 132, "Angleterre")

    private val Match1 = Match(1, AD, MR, '2', "Hale", "13h00",
        Pointage(listOf(1, 1), listOf(listOf(4, 2), listOf(6, 4),listOf(0, 0)), listOf(40,30), false),
        0.0, 0, 1.0, 4, listOf(1, 1))
    private val Match2 = Match(2, AM, AR,  '1', "Hale", "12h30",
        Pointage(listOf(1, 1), listOf(listOf(6, 2), listOf(3, 1),listOf(0, 0)), listOf(15,40), false),
        0.0, 1, 1.0, 4, listOf(1, 1))

    val retrofitService : BonPariApiService = object : BonPariApiService {
        override suspend fun getAllGames(): List<Match> {
            when (++requestId) {
                1 -> addMatch(Match1)
                2 -> addMatch(Match2)
            }
            return matches;
        }

        override suspend fun getGame(id: Int): Match? {
            return when (id) {
                1 -> Match1
                2 -> Match2
                else -> null
            }
        }
    }
}