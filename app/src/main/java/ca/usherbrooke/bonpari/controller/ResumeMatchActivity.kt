package ca.usherbrooke.bonpari.controller

import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import ca.usherbrooke.bonpari.R
import ca.usherbrooke.bonpari.api.Match
import ca.usherbrooke.bonpari.api.Pointage
import com.google.android.material.dialog.MaterialAlertDialogBuilder

class ResumeMatchActivity : AppCompatActivity() {

    private lateinit var match: TextView
    private lateinit var buttonBet1:Button
    private lateinit var buttonBet2:Button

    private lateinit var player1: TextView
    private lateinit var player1set1: TextView
    private lateinit var player1set2: TextView
    private lateinit var player1set3: TextView
    private lateinit var player1game: TextView
    private lateinit var player1reclame: TextView
    private lateinit var service1: TextView

    private lateinit var player2: TextView
    private lateinit var player2set1: TextView
    private lateinit var player2set2: TextView
    private lateinit var player2set3: TextView
    private lateinit var player2game: TextView
    private lateinit var player2reclame: TextView
    private lateinit var service2: TextView



    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_resume_match)

        match = findViewById(R.id.match)

        service1 = findViewById(R.id.service1)
        service2 = findViewById(R.id.service2)

        val matchSerializable: Match? = intent.getSerializableExtra("match") as Match?

        buttonBet1 = findViewById(R.id.buttonBet1)
        buttonBet2 = findViewById(R.id.buttonBet2)

        player1 = findViewById(R.id.player1)
        player1set1 = findViewById(R.id.player1set1)
        player1set2 = findViewById(R.id.player1set2)
        player1set3 = findViewById(R.id.player1set3)
        player1game = findViewById(R.id.player1game)
        player1reclame = findViewById(R.id.reclamation1)


        player2 = findViewById(R.id.player2)
        player2set1 = findViewById(R.id.player2set1)
        player2set2 = findViewById(R.id.player2set2)
        player2set3 = findViewById(R.id.player2set3)
        player2game = findViewById(R.id.player2game)
        player2reclame = findViewById(R.id.reclamation2)


        player1.text = matchSerializable?.Player1?.firstName
        player2.text = matchSerializable?.Player2?.firstName
        player1reclame.text =  matchSerializable?.contestation?.get(0).toString()
        player2reclame.text =  matchSerializable?.contestation?.get(1).toString()

        val mpointage: Pointage? = matchSerializable?.score
        if(mpointage != null) {
            player1set1.text = mpointage.jeu[0][0].toString()
            player1set2.text = mpointage.jeu[0][1].toString()
            //player1set3.text = mpointage.jeu[0][2].toString()
            player1game.text = mpointage.echange[0].toString()
            player2set1.text = mpointage.jeu[1][0].toString()
            player2set2.text = mpointage.jeu[1][1].toString()
            //player2set3.text = mpointage.jeu[1][2].toString()
            player2game.text = mpointage.echange[1].toString()

        }

        if (matchSerializable?.serveur == 0) {
            service1.text = "°"
            service2.text = ""
        } else {
            service1.text = ""
            service2.text = "°"
        }

        val buttonRefresh:Button = findViewById(R.id.buttonRefresh)
        buttonBet1.setOnClickListener {
            var input : EditText = EditText(this)

            MaterialAlertDialogBuilder(this)
                .setTitle("Montant à parier joueur1")
                // by default, pressing "back" closes the popup
                .setCancelable(false)
                .setView(input)
                .setNegativeButton("Annuler") { _, _ ->
                }
                .setPositiveButton("Confirmer") { _, _ -> Log.d("back", input.text.toString())
                }
                .show()
        }
        buttonBet2.setOnClickListener {
            var input : EditText = EditText(this)

            MaterialAlertDialogBuilder(this)
                .setTitle("Montant à parier joueur2")
                // by default, pressing "back" closes the popup
                .setCancelable(false)
                .setView(input)
                .setNegativeButton("Annuler") { _, _ ->
                }
                .setPositiveButton("Confirmer") { _, _ -> Log.d("back", input.text.toString())
                }
                .show()
        }

        buttonRefresh.setOnClickListener { }

    }
}