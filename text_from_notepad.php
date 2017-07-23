<?php 
	function loadText($dir){
		echo iconv("WINDOWS-1251", "UTF-8", file_get_contents($dir));
	}
if (!empty($_POST["txt"]))  loadText($_POST["txt"]);