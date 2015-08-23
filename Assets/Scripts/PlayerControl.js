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


public var maxDamageClickDuration : float = 1.0;
private var currentDamageClickDuration : float;


// how far the guide goes
public var guideLength : float = 0.1;


// sounds
public var jump : AudioClip;
public var chompFirst : AudioClip;
public var chompRepeating : AudioClip;
public var hurt : AudioClip;





// guide line that shows the player how charged they are
private var lineRenderer : LineRenderer;


// the knight we're attached to
private var attachedKnight : GameObject;
private var attachPoint : Transform;
private var knightControl : KnightControl;


private var rb : Rigidbody2D;
private var playerAudio : AudioSource;
private var playerCollider: BoxCollider2D;
private var playerAnimator : Animator;
private var currentStrength : float;
private var isTouchingGround : boolean;


function Awake () {
	rb = GetComponent. < Rigidbody2D > ();
	playerCollider = GetComponent. < BoxCollider2D > ();
	playerAudio = GetComponent. < AudioSource > ();
	playerAnimator = GetComponent. < Animator > ();
	currentStrength = minJumpStrength;
	lineRenderer = GetComponent. < LineRenderer > ();
	currentDamageClickDuration = 0;
}

function FixedUpdate() {
	// if attached, move transform to knight attachpoint
	if (attachedKnight) {
		rb.MovePosition(attachPoint.position);
	}
}

function Update () {
	var isChomping = false;
	if (attachedKnight) {
		isChomping = true;
	}
	playerAnimator.SetBool("IsTouchingGround", isTouchingGround);
	playerAnimator.SetBool("IsChomping", isChomping);

	if (rb.velocity.x > 0.1) {
		transform.localScale.x = -1;
	}
	if (rb.velocity.x < -0.1) {
		transform.localScale.x = 1;
	}


	// if knight dies on us, detach
	if (attachedKnight == null) {
		knightControl = null;
		attachPoint = null;
	}

	// look at mouse
	var mouseWorldPosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
	mouseWorldPosition.z = 0;
	var direction = (mouseWorldPosition - transform.position).normalized;

	if (Input.GetMouseButtonDown(0)) {
		if (attachedKnight) {
			knightControl.health -= damage;
			playerAudio.clip = chompRepeating;
			playerAudio.Play();
		}
	}

	if (Input.GetMouseButton(0)) {
		if (attachedKnight) {
			currentDamageClickDuration += Time.deltaTime;
		}
		currentStrength += Time.deltaTime * jumpStrengthGrowRate;
		if (currentStrength > maxJumpStrength) {
			currentStrength = maxJumpStrength;
		}
		if (!attachedKnight || (currentDamageClickDuration > maxDamageClickDuration)) {
			lineRenderer.enabled = true;
			lineRenderer.SetPosition (0, transform.position);
			lineRenderer.SetPosition (1, transform.position + (direction * currentStrength * guideLength));
		}
	}


	if (Input.GetMouseButtonUp(0)) {
		if (attachedKnight && (currentDamageClickDuration < maxDamageClickDuration)) {
			// break
			// Debug.Log(currentDamageClickDuration);
			currentDamageClickDuration = 0;
		}
		else if (isTouchingGround || attachedKnight) {
			if (attachedKnight) {
				DetachFromKnight();
			}
			rb.velocity += (direction * baseJumpMultiplier * currentStrength);
			playerAudio.clip = jump;
			playerAudio.Play();
			currentDamageClickDuration = 0;
			// Debug.Log(rb.velocity);
		}
		currentStrength = minJumpStrength;
		lineRenderer.enabled = false;
	}

}

function OnCollisionEnter2D (collision : Collision2D) {
	// Debug.Log(collision.gameObject);
	if (collision.gameObject.CompareTag("Jumpable")) {
		isTouchingGround = true;
		// Debug.Log(isTouchingGround);
	}
	CheckKnight(collision);
}

function CheckKnight(collision : Collision2D) {
	if (collision.gameObject.CompareTag("Knight")) {
		// Debug.Log("knight!");

		if ((collision.gameObject != attachedKnight) && !attachedKnight) {
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
	knightControl.CancelInvoke("Windup");
	playerAudio.clip = chompFirst;
	playerAudio.Play();
}

public function DetachFromKnight() {
	if (attachedKnight) {
		knightControl.attached = false;
		knightControl.ReEnableCollision();
		attachedKnight = null;
		knightControl = null;
		attachPoint = null;
	}
}

public function Hurt() {
	playerAudio.clip = hurt;
	playerAudio.Play();
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
