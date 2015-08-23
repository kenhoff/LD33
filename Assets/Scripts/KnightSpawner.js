#pragma strict

public var Knight : GameObject;
public var delay : float = 3;
public var spawnRate : float = 3;

function Awake () {
	// InvokeRepeating("SpawnKnight", delay, spawnRate);
}

function SpawnKnight() {
	Instantiate(Knight, transform.position, Quaternion.identity);
}
