package ca.usherbrooke.bonpari.model

import android.annotation.SuppressLint
import android.content.ContentResolver
import android.provider.Settings
import android.util.Log

object LocalStorage {
    const val NO_FOLLOWED_MATCH: Int = -1

    var currentMatchFollowedId : Int = NO_FOLLOWED_MATCH

    fun isFollowingAMatch() = currentMatchFollowedId != NO_FOLLOWED_MATCH

    private var _deviceId: String? = null
    val deviceId : String
        get() = _deviceId!!

    @SuppressLint("HardwareIds")
    fun setDeviceId(contentResolver: ContentResolver?) {
        if (_deviceId != null) return
        _deviceId = Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID)
        Log.d("CAL", "ID is $deviceId")
    }
}