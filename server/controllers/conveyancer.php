<?php
namespace this7\app;
use this7\framework\kernel;

(new kernel())->start();
cache::test();

cache::set("dasd", "你好", "6777");

echo cache::get("dasd");