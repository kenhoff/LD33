#pragma strict

public var nextLevel : String;

function Start () {
	// print(Application.loadedLevelName);
}

function Update () {

}

function OnTriggerEnter2D(other : Collider2D) {
	if (other.CompareTag("Player")) {
		if (GameObject.FindGameObjectsWithTag("Knight").length == 0) {
			Application.LoadLevel(nextLevel);
		}
	}
}
