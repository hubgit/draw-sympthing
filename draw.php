<?php

$mongo = new Mongo();
$collection = $mongo->selectDB('draw-sympthing')->selectCollection('drawings');
$collection->ensureIndex(array('random' => 1));

switch ($_SERVER['REQUEST_METHOD']) {
	case 'GET':
		$item = randomItem($collection);
		$drawing = array(
			'x' => $item['x'],
			'y' => $item['y'],
			'drag' => $item['drag'],
			'word' => $item['word'],
		);
		header('Content-Type: application/json');
		print json_encode($drawing);
	break;

	case 'POST':
		$data = json_decode(file_get_contents('php://input'), true);

		$drawing = array(
			'word' => $data['word'], 
			'x' => $data['x'], 
			'y' => $data['y'], 
			'drag' => $data['drag'],
			'timestamp' => time(),
			'ip' => $_SERVER['REMOTE_ADDR'],
			'random' => mt_rand(),
		);

		$result = $collection->insert($drawing, array('safe' => true));
		if (!$result) throw new Exception('Not Saved');
	break;

	default:
		throw new Exception('Method Not Supported');
	break;
}

function randomItem($collection) {
	$random = mt_rand();
	$doc = $collection->findOne(array('random' => array('$gte' => $random)));
	return $doc ? $doc : $collection->findOne(array('random' => array('$lte' => $random)));
}
