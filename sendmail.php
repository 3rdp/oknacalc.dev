<?php
// адрес получателя
$to      = 'third.pancake16@gmail.com';
// тема письма
$subject = 'the subject';

echo $_SERVER['REQUEST_METHOD'] . '</br>';
var_dump($_REQUEST);
if ($_SERVER['REQUEST_METHOD'] == "GET") {
	// exit;
}


$headers = 'From: webmaster@example.com' . "\r\n" .
    'Reply-To: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();
// $name = $_POST['name'];
// $phone = $_POST['email'];
// $order = json_decode($_POST['orderdata']);
$name = $_GET['name'];
$phone = $_GET['email'];
$order = json_decode($_GET['orderdata']);
$size_h = $order->sizes->horizontal;
$profile = $order->material;
$wintype = $order->win_type;
$size_w = $order->sizes->vertical;
$stvorki = serialize($order->stvorki);
$otdelka = serialize($order->otdelka);
echo $_SERVER['REQUEST_METHOD'] . '</br>';
$message = "$name
$phone\n
Профиль: $profile
Тип окна: $wintype
Высота: $size_h
Ширина $size_w
Створки: $stvorki
Отделка: $otdelka";
echo 'here</br>';
if ($name && $phone && $order)
	$mail_sent = mail($to, $subject, $message);

// echo '</br>';
// var_dump($order);
// echo '</br>';
// echo $order->sizes->horizontal;

var_dump($mail_sent);