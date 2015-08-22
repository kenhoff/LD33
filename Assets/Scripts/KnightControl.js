#pragma strict

public var health : float = 100; // duh

public var speed : float;
public var attachPoint : Transform;
public var attached : boolean;
public var collisionReEnableTime : float = 1.0;


// death-related things
public var scared : boolean = false;
public var unscaredTime : float = 5;
public var deathRadius : float = 10;



// attack-related things
public var attackDistance : float;
public var attackForce : float;
public var attackTime : float;
public var cooldownTime : float;
private var onCooldown : boolean;



// sounds
// sounds
public var walk : AudioClip;
public var walkSoundFrequency : float = 1.0;
public var windup : AudioClip;
public var swing : AudioClip;
public var panic : AudioClip;
public var panicSoundFrequency : float = 1.0;


private var player : Transform;
private var rb : Rigidbody2D;
private var direction : int;
private var knightAudio : AudioSource;






function Awake () {
	player = GameObject.FindWithTag("Player").transform;
	rb = GetComponent. < Rigidbody2D > ();
	knightAudio = GetComponent. < AudioSource > ();
	scared = false;
	attached = false;
	onCooldown = false;
}

function Update() {
	if (health <= 0) {
		// scare all other knights in a radius
		var hitColliders : Collider2D[] = Physics2D.OverlapCircleAll(transform.position, deathRadius, 1 << LayerMask.NameToLayer("Knights"));
		for (var i = 0; i < hitColliders.length; i++) {
			var knightControl = hitColliders[i].gameObject.GetComponent. < KnightControl >();
			knightControl.scared = true;
			knightControl.GetUnScared();
			knightControl.CancelInvoke("Windup");
		}
		Destroy(gameObject);
	}
}

function FixedUpdate () {
	if (attached) {
		// flail!
		if (!IsInvoking("PickDirection")) {
			Invoke("PickDirection", 1);
		}
		if(!IsInvoking("PlayPanicSound")) {
			Invoke("PlayPanicSound", panicSoundFrequency);
		}
	}
	else if (scared) {
		direction = -((player.position - transform.position).x > 0 ? 1 : -1);
	}
	else if ((player.position - transform.position).magnitude < attackDistance) {
		direction = 0;
		// check to see if winding up; if not, start winding up
		if (!IsInvoking("Windup") && !onCooldown) {
			knightAudio.clip = windup;
			knightAudio.Play();
			Invoke("Windup", attackTime);
		}
	}
	else {
		direction = ((player.position - transform.position).x > 0 ? 1 : -1) ;
	}
	if (!IsInvoking("Windup")) {
		if (!IsInvoking("PlayWalkSound")) {
			Invoke("PlayWalkSound", walkSoundFrequency);
		}
		rb.MovePosition(rb.position + (Vector2(direction, 0) * speed * Time.deltaTime));
	}
}

function PlayWalkSound() {
	knightAudio.clip = walk;
	knightAudio.Play();
}

function PlayPanicSound() {
	knightAudio.clip = panic;
	knightAudio.Play();
}

function PickDirection() {
	// this should do the random walk stuff
	direction = (Random.value > 0.5 ? 1 : -1);
}


function Windup() {
	SwingAtPlayer();
}
function SwingAtPlayer() {
	knightAudio.clip = swing;
	knightAudio.Play();
	onCooldown = true;
	if ((player.position - transform.position).magnitude < attackDistance) {
		var playerControl = player.GetComponent. < PlayerControl > ();
		playerControl.DetachFromKnight();
		playerControl.Hurt();

		player.GetComponent.<Rigidbody2D>().AddForce( -((transform.position - player.position).normalized * attackForce), ForceMode2D.Impulse);
	}
	else {
	}
	Invoke("ResetCooldown", cooldownTime);
}


function ResetCooldown() {
	onCooldown = false;
}


public function ReEnableCollision () {
	yield WaitForSeconds(collisionReEnableTime);
	Physics2D.IgnoreCollision(player.GetComponent.<Collider2D>(), GetComponent.<Collider2D>(), false);
}

public function GetUnScared () {
	// Debug.Log("invoking getting unscared");
	// yield WaitForSeconds(unscaredTime);
	Invoke("SetUnScared", unscaredTime);
	// Debug.Log("yield complete");
}

function SetUnScared() {
	// Debug.Log("Setting unscared");
	scared = false;
}
