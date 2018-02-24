<?php

function P($name, $is_unhtml = false) {
    if ($is_unhtml) {
        $name = unhtml($name);
    }
    echo "<pre style='position:relative;z-index:1000;padding:10px;border-radius:5px;background:#F5F5F5;border:1px solid #aaa;font-size:14px;line-height:18px;opacity:0.9;'>" . print_r($name, true) . "</pre>";
}

function error(...$args) {
    $return = ClassName::error($args);
    P($return);
}

define('ROOT', preg_replace("#\/Callback#", "", trim('http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME']), '/\\')));

class ClassName {

    public function __construct() {
        # code...
    }

    public static function error($args) {
        #根据不同的参数个数进行判断
        switch (count($args)) {
        case 0:
            return [0, '成功', [], ''];
            break;
        case 1:
            $arg1 = reset($args);
            #如果是数字
            if (is_numeric($arg1)) {
                if ($arg1 === 0) {
                    return [0, '成功', [], ''];
                } else {
                    return [$arg1, '错误', [], ''];
                }
            }
            #如果是字符串
            if (is_string($arg1)) {
                return [0, $arg1, [], ''];
            }
            #如果是数组
            if (is_string($arg1)) {
                if (empty($arg1)) {
                    return [-2, '数据为空', [], ''];
                } else {
                    return [0, '成功', $arg1, ''];
                }
            }
            break;
        case 2:
            $arg1 = reset($args);
            $arg2 = next($args);
            if (is_numeric($arg1) && is_string($arg2)) {
                return [$arg1, $arg2, [], ''];
            }
            if (is_array($arg1) && is_array($arg2)) {
                #如果数组为空
                if (empty($arg2) && empty($arg1)) {
                    return [-2, '失败', [], ''];
                }
                #如果第二个参数为空
                elseif (empty($arg2)) {
                    return [-2, reset($arg1), [], ''];
                } else {
                    $arg1 = next($arg1);
                    $arg1 = empty($arg1) ? '成功' : $arg1;
                    return [0, $arg1, $arg2, ''];
                }
            }
            break;
        case 3:
            $arg1 = reset($args);
            $arg2 = next($args);
            $arg3 = next($args);
            if (is_numeric($arg1) && is_string($arg2) && is_array($arg3)) {
                return [$arg1, $arg2, $arg3, ''];
            }
            if (is_numeric($arg1) && is_string($arg2) && is_string($arg3)) {
                $arg3 = static::params($arg3) ? static::params($arg3) : $arg3;
                return [$arg1, $arg2, [], $arg3];
            }
            if (is_array($arg1) && is_array($arg2) && is_string($arg3)) {

                #如果数组为空
                if (empty($arg2) && empty($arg1)) {
                    return [-2, '失败', [], ''];
                }
                #如果第二个参数为空
                elseif (empty($arg2)) {
                    return [-2, reset($arg1), [], ''];
                } else {
                    $arg1 = next($arg1);
                    $arg1 = empty($arg1) ? '成功' : $arg1;
                    $arg3 = static::params($arg3) ? static::params($arg3) : $arg3;
                    return [0, $arg1, $arg2, $arg3];
                }
            }
            break;
        case 4:
        default:
            $arg1 = reset($args);
            $arg2 = next($args);
            $arg3 = next($args);
            $arg4 = next($args);
            if (is_numeric($arg1) && is_string($arg2) && is_array($arg3) && is_string($arg4)) {
                $arg4 = static::params($arg4) ? static::params($arg4) : $arg4;
                return [$arg1, $arg2, $arg3, $arg4];
            }
            break;
        }
        return [-2, '方法传入参数错误', [], ''];
    }

    public static function params($url) {
        $path  = explode('?', $url)[0];
        $query = parse_url($url, PHP_URL_QUERY);
        if ($query) {
            return static::getUrl($path, $query);
        } else {
            return false;
        }
    }

    /**
     * URL地址获取
     * @param  sting $address   需要解析的地址用/分割
     * @param  sting $parameter 需要解析的参数
     * @return url              返回路径
     */
    public static function getUrl($address = NULL, $parameter = NULL) {
        if (strstr($address, "http://") || strstr($address, "https://") || strstr($address, "//")) {
            return $address;
        }
        $array = explode("/", $address);
        $count = count($array);
        $par   = array();
        $url   = null;
        switch ($count) {
        case '3':
            $root     = rtrim(ROOT, "/") . '/' . $array[0];
            $par['c'] = $array[1];
            $par['a'] = $array[2];
            break;
        case '2':
            $root     = rtrim(ROOT, "/");
            $par['c'] = $array[0];
            $par['a'] = $array[1];
            break;
        default:
        case '1':
            $root     = rtrim(ROOT, "/");
            $par['c'] = $_GET['model'];
            $par['a'] = $array[0];
            break;
        }
        #转换参数信息
        if (!empty($parameter)) {
            if (strstr($parameter, "=")) {
                $array = strstr($parameter, ";") ? explode(';', $parameter) : explode('&', $parameter);
                foreach ($array as $key => $value) {
                    $value          = explode('=', $value);
                    $par[$value[0]] = $value[1];
                }
            } elseif (strstr($parameter, "/")) {
                $array = explode('/', $parameter);
                for ($i = 0; $i < count($array); $i += 2) {
                    $par[$array[$i]] = $array[$i + 1];
                }
            } elseif (is_array($parameter)) {
                $par = $parameter;
            }
        }
        #进行参数拼接
        foreach ($par as $key => $value) {
            if ($key == 'c' || $key == 'a' || $key == 'w') {
                $url .= "/{$value}";
            } else {
                $url .= "/{$key}/{$value}";
            }
        }
        return $root . $url;
    }

}
/**
 * 只输入数字
 */
error(-99);
/**
 * 只输入文字
 */
error("测试成功");
/**
 * 只输入数组
 */
error(array("UID" => 987));
/**
 * 常规 1:数字 2:字符串
 */
error(-1, "注册失败");
error(['注册失败'], []);
error(['注册失败'], array("UID" => 987));
error(['注册失败', '注册成功'], array("UID" => 987));
/**
 * 常规 1:数字 2:字符串 3:数组
 */
error(-22, "测试成功", array("UID" => 1));
error(-22, "测试成功", 'page/ddd');
error(-22, "测试成功", 'page/ddd?id=1&UID=2');
#当成功的时候第三个参数才会成为路径返回，否则为空
error(['写入失败'], [], 'page/ddd');
error(['写入失败'], array("UID" => 987), 'page/ddd?id=1&UID=2');
error(['写入失败', ' 写入成功'], array("UID" => 987), 'page/ddd?id=1&UID=2');
/**
 * 常规 1:数字 2:字符串 3:数组 4:地址
 */
error(-22, "测试成功", array("UID" => 1), 'page/ddd?id=1&UID=2');
error(-22, "测试成功", array("UID" => 1), 'page/ddd');