#pragma strict

public var health : float = 100; // duh

public var speed : float;
public var attachPoint : Transform;
public var attached : boolean;
public var collisionReEnableTime : float = 1.0;
public var scared : boolean = false;
public var unscaredTime : float = 5;
public var deathRadius : float = 10;

private var player : Transform;
private var rb : Rigidbody2D;
private var direction : int;






function Awake () {
	player = GameObject.FindWithTag("Player").transform;
	rb = GetComponent. < Rigidbody2D > ();
	scared = false;
	attached = false;
}

function Update() {
	if (health <= 0) {
		// scare all other knights in a radius
		var hitColliders : Collider2D[] = Physics2D.OverlapCircleAll(transform.position, deathRadius, 1 << LayerMask.NameToLayer("Knights"));
		for (var i = 0; i < hitColliders.length; i++) {
			var knightControl = hitColliders[i].gameObject.GetComponent. < KnightControl >();
			knightControl.scared = true;
			knightControl.GetUnScared();
		}
		Destroy(gameObject);
	}
}

function FixedUpdate () {
	if (!attached) {
		direction = ((player.position - transform.position).x > 0 ? 1 : -1) ;
		if (scared) {
			direction = -direction;
		}
	}
	if (attached && !IsInvoking("PickDirection")) {
		Invoke("PickDirection", 1);
	}
	rb.MovePosition(rb.position + (Vector2(direction, 0) * speed * Time.deltaTime));
}

public function ReEnableCollision () {
	yield WaitForSeconds(collisionReEnableTime);
	Physics2D.IgnoreCollision(player.GetComponent.<Collider2D>(), GetComponent.<Collider2D>(), false);
}

public function GetUnScared () {
	Debug.Log("invoking getting unscared");
	// yield WaitForSeconds(unscaredTime);
	Invoke("SetUnScared", unscaredTime);
	// Debug.Log("yield complete");
}

function SetUnScared() {
	Debug.Log("Setting unscared");
	scared = false;
}

function PickDirection() {
	// this should do the random walk stuff
	direction = (Random.value > 0.5 ? 1 : -1);
}
