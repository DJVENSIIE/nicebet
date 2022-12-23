package ca.usherbrooke.bonpari.api

import com.squareup.moshi.Json
import org.json.JSONObject
import java.io.Serializable

data class Player(
    @Json(name = "prenom") val firstName: String,
    @Json(name = "nom") val lastName: String,
    @Json(name = "age") val age: Int,
    @Json(name = "rang") val rank: Int,
    @Json(name = "pays") val country: String) : Serializable {

    fun getFullName() : String = "$firstName $lastName"

    companion object {
        fun fromJsonObject(jsonObject: JSONObject) : Player {
            return Player(
                jsonObject.getString("prenom"),
                jsonObject.getString("nom"),
                jsonObject.getInt("age"),
                jsonObject.getInt("rang"),
                jsonObject.getString("pays")
            )
        }
    }
}


