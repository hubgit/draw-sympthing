<?php

$output = fopen('drawings.txt', 'a');
fwrite($output, file_get_contents('php://input') . "\n");
fclose($output);
