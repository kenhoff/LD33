#pragma strict

import System.Collections.Generic;

public var titleObject : List.<UI.Image>;
public var titleFadeRate : float;
private var fade : boolean;

public var KnightPrefab : GameObject;
public var knightSpawnPoint : Transform;
public var startWait: float = 3;
public var timeBetweenWaves : float = 10;
public var timeBetweenSpawns : float = 1;
public var knightsPerWave : int = 3;
private var isSpawning : boolean;


function Awake () {
	fade = false;
	isSpawning = false;
}

function SpawnWaves() {
	yield WaitForSeconds(startWait);
	while (true) {
		for (var i = 0; i < knightsPerWave; i++) {
			Instantiate(KnightPrefab, knightSpawnPoint.position, Quaternion.identity);
			yield WaitForSeconds(timeBetweenSpawns);
		}
		yield WaitForSeconds(timeBetweenWaves);
	}
}

function Update () {
	if (Input.GetMouseButtonUp(0)) {
		Debug.Log("setting to fade");
		fade = true;
		if (!isSpawning) {
			SpawnWaves();
			isSpawning = true;
			// print("spawning!");
		}
	}
	if (fade) {
		for (var i = 0; i < titleObject.Count; i++) {
			titleObject[i].color = Color.Lerp(titleObject[i].color, Color.clear, Time.deltaTime * titleFadeRate);
		}
	}
}
