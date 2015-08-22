#pragma strict

public var speed : float;

private var player : Transform;
private var rb : Rigidbody2D;

function Awake () {
	player = GameObject.FindWithTag("Player").transform;
	rb = GetComponent. < Rigidbody2D > ();
}

function FixedUpdate () {
	var direction = ((player.position - transform.position).x > 0 ? 1 : -1) ;
	rb.MovePosition(rb.position + (Vector2(direction, 0) * speed * Time.deltaTime));
}
