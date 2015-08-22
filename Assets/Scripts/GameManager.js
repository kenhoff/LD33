#pragma strict

import System.Collections.Generic;

public var titleObject : List.<UI.Image>;

public var titleFadeRate : float;

private var fade : boolean;

function Awake () {
	fade = false;
}

function Update () {
	if (Input.GetMouseButtonUp(0)) {
		// Debug.Log("setting to fade");
		fade = true;
	}
	if (fade) {
		for (var i = 0; i < titleObject.Count; i++) {
			titleObject[i].color = Color.Lerp(titleObject[i].color, Color.clear, Time.deltaTime);
		}
	}
}
