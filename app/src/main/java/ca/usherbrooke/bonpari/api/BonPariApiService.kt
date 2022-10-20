package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import kotlinx.coroutines.delay
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

object BonPariFakeApi {
    private val matches = mutableListOf<Match>()
    private var requestId: Int = 0

    private fun addMatch(match: Match) {
        matches.add(match)
    }

    private val AlbertRamos = Player("Albert", "Ramos", 28, 56, "Espagne")
    private val MilosRaonic = Player("Milos", "Raonic", 28, 16, "Canada")
    private val AndyRoddick = Player("Andy", "Roddick", 36, 1000, "États-Unis")
    private val AndyMurray = Player("Andy", "Murray", 28, 132, "Angleterre")

    val retrofitService : BonPariApiService = object : BonPariApiService {
        override suspend fun getAllGames(): List<Match> {
            val score1 = Pointage(
                listOf(1, 1),
                listOf(listOf(4, 2), listOf(6, 4),listOf(0, 0)),
                listOf(40,30),
                false
            )

            val score2 = Pointage(
                listOf(1, 1),
                listOf(listOf(6, 2), listOf(3, 1),listOf(0, 0)),
                listOf(15,40),
                false
            )

            when (++requestId) {
                1 -> {
                    addMatch(Match(
                        AlbertRamos,
                        MilosRaonic,
                        '2',
                        "Hale",
                        "13h00",
                        score1,
                        0.0,
                        0,
                        1.0,
                        4,
                        listOf(1, 1)))
                }
                2 -> {
                    addMatch(Match(MilosRaonic, AndyRoddick,  '1',
                        "Hale",
                        "12h30",
                        score2,
                        0.0,
                        1,
                        1.0,
                        4,
                        listOf(1, 1)))
                }
            }

//            addMatch(Match(AndyRoddick, AndyMurray, '1', "Hale", "16h30"))
//            addMatch(Match(AndyMurray, AlbertRamos, '2', "Hale", "17h30"))

            return matches;
        }
    }
}