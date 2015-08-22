#pragma strict

public var health : float = 100; // duh

public var speed : float;
public var attachPoint : Transform;
public var attached : boolean;
public var collisionReEnableTime : float = 1.0;

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

public function ReEnableCollision () {
	yield WaitForSeconds(collisionReEnableTime);
	Physics2D.IgnoreCollision(player.GetComponent.<Collider2D>(), GetComponent.<Collider2D>(), false);
	Debug.Log("Knight collision re-enabled");
}
