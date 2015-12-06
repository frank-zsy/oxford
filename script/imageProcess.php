<?php
/* error: {error: errno}
 * errno: 1 invalid params
 *        2 invalid file type
 *        3 file process error
 */
ini_set("display_errors", "on");

$noError = 0;
$invalidParams = 1;
$invalidFileType = 2;
$processError = 3;
$echoMsg = array("error" => $noError);

function exitWithErr($err) {
  $echoMsg["error"] = $err;
  echo json_encode($echoMsg);
  exit();
}

if (!isset($argv[1])) {
  exitWithErr($invalidParams);
}
$paramsStr = $argv[1];

$params = json_decode($paramsStr, true);

if (!isset($params['filePath']) || !isset($params['faceLandmarks']) || !isset($params['faceRectangle']) || !is_file($params['filePath'])) {
  exitWithErr($invalidParams);
}

$filePath = $params['filePath'];
$fileInfo = pathinfo($filePath);

$extension = $fileInfo["extension"];
if ($extension == "png") {
  $img = imagecreatefrompng($filePath);
} else if ($extension == "jpg" || $extension == "jpeg") {
  $img = imagecreatefromjpeg($filePath);
  $exif = exif_read_data($filePath);
  if(!empty($exif["Orientation"])) {
    switch($exif["Orientation"]) {
      case 8:
       $img = imagerotate($img, 90, 0);
       break;
      case 3:
       $img = imagerotate($img, 180, 0);
       break;
      case 6:
       $img = imagerotate($img, -90, 0);
       break;
    }
  }
} else {
  exitWithErr($invalidFileType);
}

if (!is_resource($img)) {
  exitWithErr($processError);
}

$faceWidth = $params['faceRectangle']['width'];

// Draw landmarks
$dotSize = ceil($faceWidth / 55);
$landmarks = $params['faceLandmarks'];
foreach ($landmarks as $index => $value) {
  if (!imagefilledellipse($img, (int)$value['x'], (int)$value['y'], $dotSize, $dotSize, 0x00FFFF)) {
    exitWithErr($processError);
  }
}

// Draw face border
$borderSize = ceil($faceWidth / 65);
$faceRectangle = $params['faceRectangle'];
$top = (int)$faceRectangle['top'];
$left = (int)$faceRectangle['left'];
$width = (int)$faceRectangle['width'];
$height = (int)$faceRectangle['height'];
if (!imagerectangle($img, $left, $top, $left + $width, $top + $height, 0x00FFFF)) {
  exitWithErr($processError);
}

// Image chop
$borderMargin = ceil($faceWidth / 5);
$newTop = $top - $borderMargin;
$newLeft = $left - $borderMargin;
$newWidth = $width + 2 * $borderMargin;
$newHeight = $height + 2 * $borderMargin;
$targetImg = imagecreatetruecolor($newWidth, $newHeight);
if (!imagecopy($targetImg, $img, 0, 0, $newLeft, $newTop, $newWidth, $newHeight)) {
  exitWithErr($processError);
}

$outputDir = dirname(__DIR__) . "/assets/images/marked/";
if(!is_dir($outputDir)) {
  mkdir($outputDir, 755, true);
}
$fileName = strstr($fileInfo['basename'], $extension, true) . "marked.png";

$newFilePath = $outputDir . $fileName;
if (!imagepng($targetImg, $newFilePath, 6)) {
  exitWithErr($processError);
}

imagedestroy($img);
imagedestroy($targetImg);

require(__DIR__ . "/vendor/autoload.php");

$ak = "u0Hh9z4LgN3GuAa00sY40N5pCBVH1aCOdHmtFrw8";
$sk = "_rvJkwDArh0A7rfqbBtxgaQUiUgooz2oBoHQ9r09";
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
$auth = new Auth($ak, $sk);
$bucket = "public";
$token = $auth->uploadToken($bucket);
$key = $fileName;
$uploadMgr = new UploadManager();
list($ret, $err) = $uploadMgr->putFile($token, $key, $newFilePath);

$echoMsg["newPath"] = "http://cdn.frankzhao.org/" . $key;
echo json_encode($echoMsg);
exit();
