<?php

$lines = file('human-disease-ontology.obo');

$output = fopen('words.txt', 'w');

$words = array();

foreach ($lines as $line) {
	if (preg_match('/name:\s+(.+)/', $line, $matches)) {
		list(, $name) = $matches;
		if (strpos($name, '_') !== false) continue;
		if (strpos($name, '<') !== false) continue;
		$words[] = strtolower($name);
	} 
}

$words = array_unique($words);
sort($words);

foreach ($words as $word) {
	fwrite($output, $word . "\n");
}