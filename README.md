# three.js-object-controls
three.js-object-controls Control object rotation, scale。
控制物体的旋转和缩放。  
适合的场景是物体在坐标原点，绕Y轴左右旋转，绕X轴上下旋转，所以相机必须在Z轴上。
比较类似orbitcontrols，但是功能更弱。合适演示地球，
## 使用方法

加载js文件

```   
<script src="three.min.js"></script>
<script src="ObjectControls.js"></script>
```

创建camera、renderer、mesh。
* camera
* renderer element
* the mesh to move

```
var controls = new THREE.ObjectControls(camera, renderer.domElement, myMesh);
```

[演示地址](https://scqilin.github.io/three.js-object-controls/index.html)

### 配置

可配置的选项

* 旋转速度
* 缩放速度
* 缩放的级别
* 上下旋转的角度

```
controls.setZoomlevel(0.5, 2); // 缩放级别
controls.setZoomSpeed(1); // 缩放速度
controls.setRotationSpeed(1); //旋转速度
controls.setAngle(-0.5,0.5)// 上下旋转角度 我还没写
```

### 我为什么有这样的需求？
我想做个地球，用plane做背景，还有其他的元素。我只转动地球，这样就要求其他的不能转动。所以就控制地球了。
上面的代码基本可以完成我的工作，但是上下旋转的时候背景就出了问题，于是我加了一行代码plane.lookAt(camera.position);让背景始终朝向相机。

还有其他的问题，我没有去测试，比如移动端、浏览器的兼容性。先凑合用吧，有需要再更新。

### GitHub上有这个插件
在这个基础上修改的，[threeJS-object-controls](https://github.com/albertopiras/threeJS-object-controls)。发现原作者的代码不能工作，和自己期望的也不太一样，就简单的修改了一下。



