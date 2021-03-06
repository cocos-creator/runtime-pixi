
var EngineWrapper = Fire.Class({
    name: 'Runtime.EngineWrapper',
    extends: Fire.Runtime.EngineWrapper,
    constructor: function () {
        this._stage = null;
        this._designResolution = Fire.Vec2.zero
    },

    properties: {
        canvasSize: {
            default: Fire.Vec2.zero,
            type: Fire.Vec2,

            notify: function () {
                this._renderer.resize( this.canvasSize.x, this.canvasSize.y );

                var renderer = this._renderer;
                var view = renderer.view;

                view.style.width = renderer.width / renderer.resolution + 'px';
                view.style.height = renderer.height / renderer.resolution + 'px';
            }
        },

        designResolution: {
            get: function () {
                return _designResolution;
            },
            set: function (value) {
                this._designResolution = value;
            }
        },

        renderer: {
            get: function () {
                return this._renderer;
            }
        },

        _renderer: {
            default: null
        },
        _stage: {
            default: null
        },
        _designResolution: {
            default: null
        }
    },

    initRuntime: function (options, callback) {
        var width  = options.width  || 640;
        var height = options.height || 480;
        var canvas = options.canvas;

        var config = {
            'view'                  : canvas,
            'transparent'           : true,
            'antialias'             : false,
            'preserveDrawingBuffer' : false,
            'resolution'            : Fire.isEditor ? 1 : window.devicePixelRatio,
        };

        this._renderer = PIXI.autoDetectRenderer( width , height , config , false);

        this.canvasSize = Fire.v2(width, height);
        this.designResolution = Fire.v2(options.designWidth, options.designHeight);
        this._setCurrentSceneN(new PIXI.fireball.Stage());

        // Stop shared tick in editor
        if (FIRE_EDITOR) {
            PIXI.ticker.shared.stop();
            PIXI.ticker.shared.autoStart = false;
        }

        if (callback) {
            callback();
        }
    },

    playRuntime: function () {
    },

    stopRuntime: function () {
    },

    pauseRuntime: function () {
    },

    resumeRuntime: function () {
    },

    animateRuntime: function (dt) {

    },

    updateRuntime: function (dt) {
        Runtime.deepQueryChildren(this._stage, function (child) {
            if (child.tick) {
                child.tick(dt);
            }
            return true;
        });
    },

    renderRuntime: function () {
        this._renderer.render(this._stage);
    },

    _setCurrentSceneN: function (scene) {
        this._stage = scene;
    },

    getCurrentSceneN: function () {
        return this._stage;
    },

    getIntersectionList: function (rect) {
        var scene = this.getCurrentScene();
        var list = [];

        Runtime.deepQueryChildren(scene, function (child) {

            var bounds = child.getWorldBounds();

            // if intersect aabb success, then try intersect obb
            if (rect.intersects(bounds)) {
                bounds = child.getWorldOrientedBounds();

                var polygon = new Fire.Polygon(bounds);

                if (Fire.Intersection.rectPolygon(rect, polygon)) {
                    list.push(child.targetN);
                }
            }

            return true;
        });

        return list;
    }
});

Runtime.EngineWrapper = module.exports = EngineWrapper;
