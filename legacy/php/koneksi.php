<?php 
$koneksi = new mysqli('localhost','root','','berwisata');
if ($koneksi->connect_error) {
    die("Koneksi gagal : " . $koneksi->connect_error . "<br>");
}
echo "Koneksi sukses. <br>";
?>