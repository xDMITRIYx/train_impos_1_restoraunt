<?php
function images($dir) {
	$files = array_diff(scandir($dir), array(".", ".."));
	foreach($files as $value) {
		$path = $dir.$value;
		if (/*!is_dir($path) &&*/ pathinfo($path)["extension"] == "jpg"||"jpeg"||"png") {
			 echo $path."|";
			 // echo "<br>";
			 // echo $files;
			 //  echo "<br>";
			 // echo $dir;
			// echo "<img src='".$path."'/>";
		}
	}
}
if (!empty($_POST["fonder"])) images($_POST["fonder"]);
