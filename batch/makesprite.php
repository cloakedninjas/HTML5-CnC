<?php

$src = "D:/www/HTML5-CnC/batch/src";
$dest = "D:/www/HTML5-CnC/batch/output";

$folder = opendir($src);

$prev_sprite = null;

while (($entry = readdir($folder)) !== false) {
	if ($entry == '.' || $entry == '..') {
		continue;
	}

	$src_img = imagecreatefrompng($src . '/' . $entry);

	$w = imagesx($src_img);
    $h = imagesy($src_img);

    $dest_img = imagecreatetruecolor($w, $h);

    $transparent = imagecolorallocatealpha($dest_img, 255, 255, 255, 127);
	$shadow = imagecolorallocatealpha($dest_img, 0, 0, 0, 30);

	imagefill($dest_img, 0, 0, $transparent);

    imagecopy($dest_img, $src_img, 0, 0, 0, 0, $w, $h);
    imageAlphaBlending($dest_img, false);
    imageSaveAlpha($dest_img, true);

    for($y=0; $y<$h; $y++) {
		for($x=0; $x<$w; $x++) {
			$colpx = imagecolorsforindex($dest_img, imagecolorat($dest_img, $x, $y));

			// set black to transparent
			if ($colpx['red'] == 0 && $colpx['green'] == 0 && $colpx['blue'] == 0) {
				imagesetpixel($dest_img, $x, $y, $transparent);
			}

			// green to 50% black
			if ($colpx['red'] == 85 && $colpx['green'] == 255 && $colpx['blue'] == 85) {
				imagesetpixel($dest_img, $x, $y, $shadow);
			}
		}
    }

	imagepng($dest_img, $dest . '/'. $entry);

	imagedestroy($dest_img);
	imagedestroy($src_img);

	unlink($src . '/' . $entry);
}

//preg_match("/(\D+) \d\d\d\d\.png/", )

$files = glob("$dest/*.png*");

$count = count($files);

$img = imagecreatefrompng($files[0]);

$height = imagesy($img);
$width = imagesx($img);

$dest_img = imagecreatetruecolor($width * $count, $height);

$transparent = imagecolorallocatealpha($dest_img, 255, 255, 255, 127);

imagefill($dest_img, 0, 0, $transparent);
imageAlphaBlending($dest_img, false);
imageSaveAlpha($dest_img, true);

$i = 0;
foreach ($files as $file) {
	
	$src_img = imagecreatefrompng($file);
	$offset_x = $i * $width;
	
	imagecopy($dest_img, $src_img, $offset_x, 0, 0, 0, $width, $height);
	
	$i++;
}

imagepng($dest_img, $dest . '/sprite.png');

	imagedestroy($dest_img);
	imagedestroy($src_img);
