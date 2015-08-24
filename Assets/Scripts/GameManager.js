#pragma strict

import System.Collections.Generic;

public var titleObject : List.<UI.Image>;
public var titleFadeRate : float;
private var fade : boolean;


// dev flag
public var SpawnEnabled : boolean = true;
public var InfiniteSpawn : boolean = false;

public var KnightPrefab : GameObject;
public var knightSpawnPoints : List.<Transform>;
public var startWait: float = 3;
public var timeBetweenWaves : float = 10;
public var timeBetweenSpawns : float = 1;
public var knightsPerWave : int = 3;
public var numberOfKnightsTotal : int = 3;
private var isSpawning : boolean;
private var numberOfKnightsSpawned : int;

function Awake () {
	fade = false;
	isSpawning = false;
	numberOfKnightsSpawned = 0;
	if (!isSpawning && SpawnEnabled) {
		isSpawning = true;
		SpawnWaves();
	}
}

function SpawnWaves() {
	yield WaitForSeconds(startWait);
	while ((numberOfKnightsSpawned < numberOfKnightsTotal) || InfiniteSpawn) {
		for (var i = 0; i < knightsPerWave; i++) {
			for (var j = 0; j < knightSpawnPoints.Count; j++) {
				Instantiate(KnightPrefab, knightSpawnPoints[j].position, Quaternion.identity);
				numberOfKnightsSpawned += 1;
			}
			yield WaitForSeconds(timeBetweenSpawns);
		}
		yield WaitForSeconds(timeBetweenWaves);
	}
}

function Update () {
	if (Input.GetMouseButtonUp(0)) {
		// Debug.Log("setting to fade");
		fade = true;
	}
	if (fade) {
		for (var i = 0; i < titleObject.Count; i++) {
			titleObject[i].color = Color.Lerp(titleObject[i].color, Color.clear, Time.deltaTime * titleFadeRate);
		}
	}
}
