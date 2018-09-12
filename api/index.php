<?php
/**
 * this7 PHP Framework
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 * @copyright 2016-2018 Yan TianZeng<qinuoyun@qq.com>
 * @license   http://www.opensource.org/licenses/mit-license.php MIT
 * @link      http://www.ub-7.com
 */
class index {
    public function index() {
        echo "API安装方法：composer create-project this7/app blog --prefer-dist<br>";
        echo "当前路径：" . ROOT . "<br>";
        echo "当前网址：" . URL . "<br>";
    }
}