#pragma strict


// base multiplier for how far he can jump
public var baseJumpMultiplier : float;

// rate at which jump strength grows when mouse is held down
public var jumpStrengthGrowRate : float = 1;

// minimum jump strength needed for hops along ground
public var minJumpStrength : float = 3;

// maximum jump strength (doesn't include base multiplier)
public var maxJumpStrength : float = 10;

// how far the guide goes
public var guideLength : float = 0.1;

// guide line that shows the player how charged they are
private var lineRenderer : LineRenderer;




private var rb : Rigidbody2D;
private var currentStrength : float;
private var isTouchingGround : boolean;


function Awake () {
	rb = GetComponent. < Rigidbody2D > ();
	currentStrength = minJumpStrength;
	lineRenderer = GetComponent. < LineRenderer > ();
}

function Update () {
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
		if (isTouchingGround) {
			rb.velocity += (direction * baseJumpMultiplier * currentStrength);
			// transform.eulerAngles.z = (Mathf.Atan2(direction.y,direction.x) * Mathf.Rad2Deg) - 90;
		}
		currentStrength = minJumpStrength;
		lineRenderer.enabled = false;
	}
}

function OnCollisionEnter2D (collision : Collision2D) {
	if (collision.gameObject.CompareTag("Jumpable")) {
		isTouchingGround = true;
		// Debug.Log(isTouchingGround);
	}
}

function OnCollisionExit2D (collision : Collision2D) {
	if (collision.gameObject.CompareTag("Jumpable")) {
		isTouchingGround = false;
		// Debug.Log(isTouchingGround);
	}
}
