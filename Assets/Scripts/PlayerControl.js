#pragma strict


// base multiplier for how far he can jump
public var baseJumpMultiplier : float;

// rate at which jump strength grows when mouse is held down
public var jumpStrengthGrowRate : float = 1;

// minimum jump strength needed for hops along ground
public var minJumpStrength : float = 3;

// maximum jump strength (doesn't include base multiplier)
public var maxJumpStrength : float = 10;


// how much damage the player does per click
public var damage : float;


// how far the guide goes
public var guideLength : float = 0.1;

// guide line that shows the player how charged they are
private var lineRenderer : LineRenderer;


// the knight we're attached to
private var attachedKnight : GameObject;
private var attachPoint : Transform;
private var knightControl : KnightControl;


private var rb : Rigidbody2D;
private var playerCollider: BoxCollider2D;
private var currentStrength : float;
private var isTouchingGround : boolean;


function Awake () {
	rb = GetComponent. < Rigidbody2D > ();
	playerCollider = GetComponent. < BoxCollider2D > ();
	currentStrength = minJumpStrength;
	lineRenderer = GetComponent. < LineRenderer > ();
}

function FixedUpdate() {
	// if attached, move transform to knight attachpoint
	if (attachedKnight) {
		rb.MovePosition(attachPoint.position);
	}
}

function Update () {

	// Debug.Log(rb.velocity);



	// look at mouse
	var mouseWorldPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	mouseWorldPosition.z = 0;
	var direction = (mouseWorldPosition - transform.position).normalized;


	if (Input.GetMouseButton(0)) {
		currentStrength += Time.deltaTime * jumpStrengthGrowRate;
		if (currentStrength > maxJumpStrength) {
			currentStrength = maxJumpStrength;
		}
		lineRenderer.enabled = true;
		lineRenderer.SetPosition (1, direction * currentStrength * guideLength);
	}


	if (Input.GetMouseButtonUp(0)) {
		if (isTouchingGround || attachedKnight) {
			if (attachedKnight) {
				DetachFromKnight();
			}
			rb.velocity += (direction * baseJumpMultiplier * currentStrength);
			// Debug.Log(rb.velocity);
		}
		currentStrength = minJumpStrength;
		lineRenderer.enabled = false;
	}

}

function OnCollisionEnter2D (collision : Collision2D) {
	Debug.Log(collision.gameObject);
	if (collision.gameObject.CompareTag("Jumpable")) {
		isTouchingGround = true;
		// Debug.Log(isTouchingGround);
	}
	if (collision.gameObject.CompareTag("Knight")) {
		// Debug.Log("knight!");
		if (collision.gameObject != attachedKnight) {
			AttachToKnight(collision.gameObject);
		}
	}
}

function AttachToKnight(knight : GameObject) {
	// set "attached" flag on player - which knight they're attached to
	attachedKnight = knight;
	knightControl = attachedKnight.GetComponent. < KnightControl >();
	attachPoint = knightControl.attachPoint;

	// disable collision
	Physics2D.IgnoreCollision(playerCollider, attachedKnight.GetComponent.<Collider2D>());

	// set "attached" flag on knight
	knightControl.attached = true;
}

function DetachFromKnight() {
	knightControl.attached = false;
	knightControl.ReEnableCollision();
	attachedKnight = null;
	knightControl = null;
	attachPoint = null;
}

function ReEnableKnightCollision(knight : GameObject) {
	yield WaitForSeconds(0.5);
	Physics2D.IgnoreCollision(playerCollider, attachedKnight.GetComponent.<Collider2D>(), false);
}

function OnCollisionExit2D (collision : Collision2D) {
	if (collision.gameObject.CompareTag("Jumpable")) {
		isTouchingGround = false;
		// Debug.Log(isTouchingGround);
	}
}
