/* 
Command and Conquer - Javascript - Multiplayer
(c) Source Code Copyright 2012 Aditya Ravi Shankar. All Rights Reserved. 

Images/Sounds are from the original Command & Conquer - Tiberian Dawn 
and belong to the original copyright holders

*/
function getLifeCode(a) {
    var b = roundFloating(a.life / a.hitPoints),
        c;
    return b > .5 ? c = "healthy" : b > .25 ? c = "damaged" : b > 0 ? c = "ultra-damaged" : c = "dead", c
}
function findAngle(a, b, c) {
    var d = (a.cgY ? a.cgY : a.y) - (b.cgY ? b.cgY : b.y),
        e = (a.cgX ? a.cgX : a.x) - (b.cgX ? b.cgX : b.x),
        f = c / 2 + Math.round(Math.atan2(e, d) * c / (2 * Math.PI));
    return f < 0 && (f += c), f >= c && (f -= c), f
}
function addAngle(a, b, c) {
    return a += b, a > c - 1 && (a -= c), a < 0 && (a += c), a
}
function angleDiff(a, b, c) {
    return a = Math.floor(a), b = Math.floor(b), a >= c / 2 && (a -= c), b >= c / 2 && (b -= c), diff = b - a, diff < -c / 2 && (diff += c), diff > c / 2 && (diff -= c), diff
}
function preloadImage(a, b) {
    var c = game;
    game.loaded = !1;
    var d = new Image;
    return d.src = "images/" + a, c.preloadCount++, $(d).bind("load", function () {
        c.loadedCount++, game.context.clearRect(250, 520, 400, 30), game.context.font = "12px Command", game.context.fillStyle = "white", game.context.fillText("Loading images ... " + c.loadedCount + "/" + c.preloadCount, 250, 530), c.loadedCount == c.preloadCount && (c.loaded = !0, game.context.clearRect(250, 520, 400, 30)), b && b(d)
    }), d
}
function createSpriteSheetCanvas(a, b, c) {
    var d = 2;
    game.type == "multi-player" && (d = multiplayer.gameObject.players.length), b.width = a.width, b.height = a.height * d;
    var e = b.getContext("2d");
    for (var f = 0; f < d; f++) e.drawImage(a, 0, a.height * f);
    var g = e.getImageData(0, 0, b.width, b.height),
        h = g.data,
        i = h.length / 4;
    for (var j = 0; j < i; j++) {
        var k = h[j * 4],
            l = h[j * 4 + 1],
            m = h[j * 4 + 2],
            n = h[j * 4 + 2];
        l == 255 && (m == 96 || m == 89 || m == 85 || m == 63) && (k == 0 || k == 85) && (h[j * 4] = 0, h[j * 4 + 1] = 0, h[j * 4 + 2] = 0, h[j * 4 + 3] = 128)
    }
    var o = palettes.yellow;
    if (game.type == "singleplayer") {
        var p;
        c == "colormap" ? p = palettes.red : p = palettes.gray;
        for (var j = i / 2; j < i; j++) {
            var k = h[j * 4],
                l = h[j * 4 + 1],
                m = h[j * 4 + 2],
                n = h[j * 4 + 2];
            for (var f = 15; f >= 0; f--) {
                var q = colors[o[f]],
                    r = colors[p[f]];
                if (Math.abs(k - q[0]) < 12 && Math.abs(l - q[1]) < 12 && Math.abs(m - q[2]) < 12) {
                    h[j * 4 + 0] = r[0], h[j * 4 + 1] = r[1], h[j * 4 + 2] = r[2];
                    break
                }
            }
        }
    } else for (var s = 0; s < d; s++) {
        var p = palettes[multiplayer.gameObject.players[s].color];
        for (var j = i * s / d; j < i * (s + 1) / d; j++) {
            var k = h[j * 4],
                l = h[j * 4 + 1],
                m = h[j * 4 + 2],
                n = h[j * 4 + 2];
            for (var f = 15; f >= 0; f--) {
                var q = colors[o[f]],
                    r = colors[p[f]];
                if (Math.abs(k - q[0]) < 12 && Math.abs(l - q[1]) < 12 && Math.abs(m - q[2]) < 12) {
                    h[j * 4 + 0] = r[0], h[j * 4 + 1] = r[1], h[j * 4 + 2] = r[2];
                    break
                }
            }
        }
    }
    return e.putImageData(g, 0, 0), b
}
function checkCollision() {
    var a = [],
        b = 1 * this.speed / game.gridSize / game.speedAdjustmentFactor,
        c = this.direction / this.directions * 2 * Math.PI,
        d = this.x - roundFloating(b * Math.sin(c)),
        e = this.y - roundFloating(b * Math.cos(c));
    for (var f = game.obstructionGrid.length - 1; f >= 0; f--) if (Math.abs(f + .5 - e) < 3) for (var g = game.obstructionGrid[f].length - 1; g >= 0; g--) game.obstructionGrid[f][g] && Math.abs(g - d + .5) < 3 && (Math.pow(g + .5 - d, 2) + Math.pow(f + .5 - e, 2) < Math.pow(this.hardCollisionRadius / game.gridSize + .5, 2) ? a.push({
        collisionType: "ultra-hard",
        "with": {
            type: "wall",
            x: g + .5,
            y: f + .5
        }
    }) : Math.pow(g + .5 - d, 2) + Math.pow(f + .5 - e, 2) < Math.pow(this.softCollisionRadius / game.gridSize + .5, 2) ? a.push({
        collisionType: "hard",
        "with": {
            type: "wall",
            x: g + .5,
            y: f + .5
        }
    }) : Math.pow(g + .5 - d, 2) + Math.pow(f + .5 - e, 2) < Math.pow(this.softCollisionRadius / game.gridSize + .7, 2) && a.push({
        collisionType: "soft",
        "with": {
            type: "wall",
            x: g + .5,
            y: f + .5
        }
    }));
    for (var f = game.items.length - 1; f >= 0; f--) {
        var h = game.items[f];
        h != this && h.type != "buildings" && (h.type == "infantry" || h.type == "vehicles") && Math.abs(h.x - d) < 4 && Math.abs(h.y - e) < 4 && (k = h.x, l = h.y, Math.pow(k - d, 2) + Math.pow(l - e, 2) < Math.pow((this.hardCollisionRadius + h.hardCollisionRadius) / game.gridSize, 2) ? a.push({
            collisionType: "hard",
            "with": h
        }) : Math.pow(k - d, 2) + Math.pow(l - e, 2) < Math.pow((this.softCollisionRadius + h.hardCollisionRadius) / game.gridSize, 2) ? a.push({
            collisionType: "soft-hard",
            "with": h
        }) : Math.pow(k - d, 2) + Math.pow(l - e, 2) < Math.pow((this.softCollisionRadius + h.softCollisionRadius) / game.gridSize, 2) && a.push({
            collisionType: "soft",
            "with": h
        }))
    }
    return a
}
function roundFloating(a) {
    return Math.round(a * 1e4) / 1e4
}
function moveTo(a) {
    this.lastMovementX = 0, this.lastMovementY = 0;
    var b = {
        x: a.x,
        y: a.y,
        type: a.type
    };
    b.type == "buildings" && (b.y = a.y + a.gridShape.length - 1, b.x = a.cgX);
    var c = [Math.floor(this.x), Math.floor(this.y)],
        d = [Math.floor(b.x), Math.floor(b.y)],
        e = $.extend([], game.foggedObstructionGrid[this.player]);
    if (b.type == "turrets" || b.type == "buildings") e[Math.floor(b.y)][Math.floor(b.x)] = 0;
    var f;
    if (c[1] < 0 || c[1] >= e.length || c[0] < 0 || c[0] > e[0].length) this.path = [], f = findAngle(b, this, this.directions);
    else {
        this.path = AStar(e, c, d, "Euclidean"), this.start = c, this.end = d;
        if (this.path.length > 1) f = findAngle(this.path[1], this.path[0], this.directions);
        else if (c == d && !e[c[1]][c[0]]) f = findAngle(b, this, this.directions);
        else return !1
    }
    var g = this.checkCollision();
    if (g.length > 0) {
        this.colliding = !0, this.path.length > 0 && g.push({
            collisionType: "attraction",
            "with": {
                x: this.path[1].x + .5,
                y: this.path[1].y + .5
            }
        });
        var h = {
            x: 0,
            y: 0
        },
            i = !1,
            j = !1;
        for (var k = g.length - 1; k >= 0; k--) {
            var l = g[k],
                m = findAngle(l.with, this, this.directions) * 2 * Math.PI / this.directions,
                n = 0;
            switch (l.collisionType) {
            case "ultra-hard":
                n = 8, i = !0;
                break;
            case "hard":
                n = 3, i = !0;
                break;
            case "soft-hard":
                n = 2;
                break;
            case "soft":
                n = 1;
                break;
            case "attraction":
                n = -0.25
            }
            h.x += roundFloating(n * Math.sin(m)), h.y += roundFloating(n * Math.cos(m))
        }
        f = findAngle(h, {
            x: 0,
            y: 0
        }, this.directions);
        if (!i) {
            var o = this.speed / game.gridSize / game.speedAdjustmentFactor,
                p = this.direction / this.directions * 2 * Math.PI;
            this.lastMovementX = -roundFloating(o * Math.sin(p)), this.lastMovementY = -roundFloating(o * Math.cos(p));
            var q = this.x + this.lastMovementX,
                r = this.y + this.lastMovementY;
            this.x = q, this.y = r, this.turnTo(f)
        } else this.turnTo(f)
    } else {
        this.colliding = !1;
        if (Math.abs(angleDiff(f, this.direction)) < this.directions / 4) {
            var o = this.speed / game.gridSize / game.speedAdjustmentFactor;
            this.prone && (o /= 2);
            var p = this.direction / this.directions * 2 * Math.PI;
            this.lastMovementX = -roundFloating(o * Math.sin(p)), this.lastMovementY = -roundFloating(o * Math.cos(p)), this.x = this.x + this.lastMovementX, this.y = this.y + this.lastMovementY
        }
        this.direction != f && this.turnTo(f)
    }
    return !0
}
function findEnemyInRange() {
    var a = 0;
    if (this.type == "vehicles" || this.type == "infantry") a = 1;
    this.orders && this.orders.type == "guard" && (a = 2), this.orders && this.orders.type == "area guard" && (a = 3), this.orders && this.orders.type == "hunt" && (a = 30);
    var b = this.weapon ? this.weapon.range : this.sight,
        c = Math.pow(b + a, 2),
        d, e, f = maps.currentMapData.allies ? maps.currentMapData.allies[this.player] : "None";
    for (var g = 0; g < game.items.length; g++) {
        var h = game.items[g];
        if (h.player != this.player && h.player != "Neutral" && h.player != f && h.player != undefined && h.type != "trees" && h.type != "walls" && (h.type != "ships" || this.type == "turrets") && h.lifeCode != "dead") {
            var i = Math.pow(h.cgX - this.x, 2) + Math.pow(h.cgY - this.y, 2);
            i <= c && (!e || d > i) && (d = i, e = h)
        }
    }
    return e
}
if (!console || !console.log) var console = {
    log: function () {}
};
Array.prototype.remove || (Array.prototype.remove = function (a) {
    var b, c;
    if ((b = this.indexOf(a)) > -1) return [].splice.apply(this, [b, b - b + 1].concat(c = [])), c
});
var colors = [
    [0, 0, 0],
    [193, 0, 173],
    [0, 175, 171],
    [0, 182, 0],
    [16, 16, 16],
    [252, 255, 50],
    [255, 49, 77],
    [186, 79, 0],
    [191, 0, 0],
    [0, 255, 255],
    [93, 0, 255],
    [30, 0, 175],
    [0, 0, 0],
    [85, 85, 85],
    [170, 170, 170],
    [255, 255, 255],
    [255, 216, 133],
    [255, 207, 143],
    [255, 208, 134],
    [255, 207, 129],
    [255, 208, 115],
    [255, 191, 108],
    [255, 192, 83],
    [252, 174, 75],
    [252, 175, 51],
    [247, 148, 10],
    [232, 117, 0],
    [217, 90, 0],
    [201, 60, 0],
    [183, 40, 0],
    [171, 12, 0],
    [153, 0, 0],
    [0, 200, 225],
    [55, 164, 205],
    [75, 139, 185],
    [87, 112, 168],
    [75, 139, 185],
    [55, 164, 205],
    [30, 182, 225],
    [255, 255, 255],
    [255, 255, 255],
    [0, 189, 0],
    [127, 0, 0],
    [127, 0, 0],
    [109, 0, 0],
    [100, 0, 0],
    [109, 0, 0],
    [19, 0, 0],
    [17, 12, 12],
    [10, 17, 12],
    [17, 11, 20],
    [11, 16, 20],
    [20, 20, 24],
    [33, 28, 28],
    [21, 33, 28],
    [32, 32, 28],
    [23, 28, 32],
    [27, 32, 36],
    [36, 36, 40],
    [50, 39, 40],
    [37, 49, 44],
    [53, 48, 44],
    [40, 39, 48],
    [41, 52, 52],
    [51, 57, 52],
    [71, 55, 56],
    [24, 71, 38],
    [47, 66, 38],
    [35, 66, 56],
    [51, 70, 55],
    [45, 83, 59],
    [68, 69, 59],
    [106, 80, 53],
    [56, 55, 69],
    [52, 69, 68],
    [49, 63, 111],
    [67, 73, 68],
    [88, 71, 72],
    [67, 87, 71],
    [83, 91, 71],
    [104, 89, 84],
    [79, 104, 74],
    [59, 104, 84],
    [84, 103, 84],
    [100, 103, 74],
    [121, 102, 74],
    [99, 107, 88],
    [120, 106, 88],
    [95, 120, 87],
    [116, 119, 91],
    [77, 120, 96],
    [78, 119, 117],
    [99, 124, 100],
    [122, 117, 117],
    [147, 86, 78],
    [143, 113, 86],
    [141, 121, 108],
    [99, 137, 90],
    [111, 137, 99],
    [110, 153, 115],
    [131, 140, 103],
    [152, 139, 102],
    [148, 152, 101],
    [131, 139, 116],
    [147, 156, 114],
    [175, 150, 114],
    [137, 170, 114],
    [169, 174, 117],
    [85, 117, 168],
    [143, 114, 172],
    [70, 134, 146],
    [114, 143, 137],
    [4, 4, 8],
    [20, 19, 28],
    [34, 44, 53],
    [50, 73, 76],
    [61, 89, 98],
    [77, 110, 118],
    [91, 130, 138],
    [106, 150, 158],
    [61, 31, 18],
    [98, 40, 24],
    [134, 39, 31],
    [170, 28, 28],
    [194, 27, 9],
    [221, 0, 0],
    [249, 0, 0],
    [255, 0, 0],
    [141, 141, 65],
    [159, 166, 86],
    [179, 191, 115],
    [198, 215, 144],
    [181, 167, 130],
    [149, 129, 116],
    [121, 100, 101],
    [0, 116, 114],
    [0, 95, 102],
    [0, 77, 94],
    [0, 59, 81],
    [0, 51, 73],
    [24, 72, 34],
    [24, 90, 41],
    [35, 106, 53],
    [42, 127, 64],
    [116, 99, 42],
    [150, 123, 57],
    [190, 147, 71],
    [229, 171, 92],
    [255, 154, 31],
    [255, 215, 40],
    [112, 75, 53],
    [137, 92, 69],
    [175, 120, 85],
    [33, 29, 53],
    [64, 64, 64],
    [165, 146, 123],
    [184, 206, 0],
    [170, 185, 0],
    [202, 219, 0],
    [0, 162, 45],
    [0, 107, 18],
    [205, 255, 255],
    [144, 208, 211],
    [213, 199, 172],
    [220, 211, 193],
    [195, 254, 0],
    [127, 238, 0],
    [109, 213, 0],
    [202, 202, 202],
    [72, 72, 72],
    [179, 177, 233],
    [159, 128, 0],
    [143, 112, 0],
    [119, 87, 0],
    [79, 33, 21],
    [145, 0, 0],
    [253, 218, 110],
    [229, 194, 95],
    [204, 173, 84],
    [184, 152, 71],
    [142, 115, 48],
    [102, 77, 30],
    [59, 45, 17],
    [17, 12, 3],
    [198, 178, 88],
    [173, 157, 77],
    [146, 141, 69],
    [126, 120, 58],
    [110, 104, 51],
    [89, 88, 40],
    [72, 70, 33],
    [57, 53, 26],
    [218, 218, 218],
    [190, 190, 190],
    [161, 161, 161],
    [133, 133, 133],
    [109, 109, 109],
    [80, 80, 80],
    [52, 52, 52],
    [24, 24, 24],
    [222, 221, 230],
    [195, 192, 211],
    [166, 162, 191],
    [134, 130, 158],
    [102, 98, 126],
    [73, 70, 94],
    [45, 42, 61],
    [20, 19, 28],
    [255, 199, 111],
    [182, 111, 70],
    [136, 173, 200],
    [95, 87, 139],
    [95, 62, 102],
    [149, 72, 97],
    [124, 47, 72],
    [150, 144, 79],
    [126, 120, 53],
    [255, 138, 146],
    [255, 118, 126],
    [0, 112, 152],
    [0, 83, 123],
    [0, 158, 146],
    [0, 129, 118],
    [0, 101, 89],
    [118, 134, 176],
    [90, 146, 201],
    [137, 137, 133],
    [149, 150, 132],
    [169, 149, 140],
    [173, 177, 139],
    [139, 132, 184],
    [154, 131, 184],
    [155, 145, 188],
    [170, 146, 171],
    [169, 148, 188],
    [201, 184, 137],
    [170, 147, 196],
    [180, 171, 204],
    [208, 178, 203],
    [234, 216, 231],
    [29, 25, 6],
    [37, 33, 10],
    [41, 37, 14],
    [47, 50, 17],
    [55, 58, 25],
    [63, 66, 29],
    [71, 74, 37],
    [79, 82, 45],
    [88, 91, 53],
    [91, 100, 61],
    [99, 108, 69],
    [107, 116, 83],
    [115, 124, 91],
    [123, 131, 103],
    [131, 139, 116],
    [255, 255, 255]
],
    palettes = {
        gdi: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
        nod: [127, 126, 125, 124, 122, 46, 120, 47, 125, 124, 123, 122, 42, 121, 120, 120],
        yellow: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
        red: [127, 126, 125, 124, 122, 46, 120, 47, 125, 124, 123, 122, 42, 121, 120, 120],
        teal: [2, 119, 118, 135, 136, 138, 112, 12, 118, 135, 136, 137, 138, 139, 114, 112],
        orange: [24, 25, 26, 27, 29, 31, 46, 47, 26, 27, 28, 29, 30, 31, 43, 47],
        green: [5, 165, 166, 167, 159, 142, 140, 199, 166, 167, 157, 3, 159, 143, 142, 141],
        gray: [161, 200, 201, 202, 204, 205, 206, 12, 201, 202, 203, 204, 205, 115, 198, 114],
        neutral: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191],
        darkgray: [14, 195, 196, 13, 169, 198, 199, 112, 14, 195, 196, 13, 169, 198, 199, 112],
        brown: [146, 152, 209, 151, 173, 150, 173, 183, 146, 152, 209, 151, 173, 150, 173, 183]
    },
    AStar = function () {
        function a(a, b, c, d, e, f, g, h, i, j, k, l, m) {
            return a && (c && !i[e][g] && (l[m++] = {
                x: g,
                y: e
            }), d && !i[e][h] && (l[m++] = {
                x: h,
                y: e
            })), b && (c && !i[f][g] && (l[m++] = {
                x: g,
                y: f
            }), d && !i[f][h] && (l[m++] = {
                x: h,
                y: f
            })), l
        }
        function b(a, b, c, d, e, f, g, h, i, j, k, l, m) {
            return a = e > -1, b = f < j, c = g < k, d = h > -1, c && (a && !i[e][g] && (l[m++] = {
                x: g,
                y: e
            }), b && !i[f][g] && (l[m++] = {
                x: g,
                y: f
            })), d && (a && !i[e][h] && (l[m++] = {
                x: h,
                y: e
            }), b && !i[f][h] && (l[m++] = {
                x: h,
                y: f
            })), l
        }
        function c(a, b, c, d, e, f, g, h, i, j, k, l, m) {
            return l
        }
        function d(a, b, c, d, e, f) {
            var g = c - 1,
                h = c + 1,
                i = b + 1,
                j = b - 1,
                k = g > -1 && !d[g][b],
                l = h < e && !d[h][b],
                m = i < f && !d[c][i],
                n = j > -1 && !d[c][j],
                o = [],
                p = 0;
            return k && (o[p++] = {
                x: b,
                y: g
            }), m && (o[p++] = {
                x: i,
                y: c
            }), l && (o[p++] = {
                x: b,
                y: h
            }), n && (o[p++] = {
                x: j,
                y: c
            }), a(k, l, m, n, g, h, i, j, d, e, f, o, p)
        }
        function e(a, b, c, d) {
            return d(c(a.x - b.x), c(a.y - b.y))
        }
        function f(a, b, c, d) {
            var e = a.x - b.x,
                f = a.y - b.y;
            return d(e * e + f * f)
        }
        function g(a, b, c, d) {
            return c(a.x - b.x) + c(a.y - b.y)
        }
        function h(h, i, j, k) {
            var l = h[0].length,
                m = h.length,
                n = l * m,
                o = Math.abs,
                p = Math.max,
                q = {},
                r = [],
                s = [{
                    x: i[0],
                    y: i[1],
                    f: 0,
                    g: 0,
                    v: i[0] + i[1] * l
                }],
                t = 1,
                u, v, w, x, y, z, A, B, C;
            j = {
                x: j[0],
                y: j[1],
                v: j[0] + j[1] * l
            };
            switch (k) {
            case "Diagonal":
                w = a;
            case "DiagonalFree":
                v = e;
                break;
            case "Euclidean":
                w = a;
            case "EuclideanFree":
                p = Math.sqrt, v = f;
                break;
            default:
                v = g, w = c
            }
            w || (w = b);
            do {
                z = n, A = 0;
                for (x = 0; x < t; ++x)(k = s[x].f) < z && (z = k, A = x);
                B = s.splice(A, 1)[0];
                if (B.v != j.v) {
                    --t, C = d(w, B.x, B.y, h, m, l);
                    for (x = 0, y = C.length; x < y; ++x)(u = C[x]).p = B, u.f = u.g = 0, u.v = u.x + u.y * l, u.v in q || (u.f = (u.g = B.g + v(u, B, o, p)) + v(u, j, o, p), s[t++] = u, q[u.v] = 1)
                } else {
                    x = t = 0;
                    do r[x++] = {
                        x: B.x,
                        y: B.y
                    };
                    while (B = B.p);
                    r.reverse()
                }
            } while (t);
            return r
        }
        return h
    }();
(function () {
    var a = 0,
        b = ["ms", "moz", "webkit", "o"];
    for (var c = 0; c < b.length && !window.requestAnimationFrame; ++c) window.requestAnimationFrame = window[b[c] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[b[c] + "CancelAnimationFrame"] || window[b[c] + "CancelRequestAnimationFrame"];
    window.requestAnimationFrame || (window.requestAnimationFrame = function (b, c) {
        var d = (new Date).getTime(),
            e = Math.max(0, 16 - (d - a)),
            f = window.setTimeout(function () {
                b(d + e)
            }, e);
        return a = d + e, f
    }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) {
        clearTimeout(a)
    })
})();
var fog = {
    fogGrid: [],
    canvas: document.createElement("canvas"),
    init: function () {
        this.context = this.canvas.getContext("2d"), this.canvas.width = maps.currentMapData.width * game.gridSize, this.canvas.height = maps.currentMapData.height * game.gridSize, this.context.fillStyle = "rgba(0,0,0,1)", this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (var a = game.players.length - 1; a >= 0; a--) {
            var b = [];
            for (var c = 0; c < maps.currentMapData.height; c++) {
                b[c] = [];
                for (var d = 0; d < maps.currentMapData.width; d++) b[c][d] = 1
            }
            this.fogGrid[game.players[a]] = $.extend([], b)
        }
    },
    isPointOverFog: function (a, b) {
        return b < 0 || b / game.gridSize >= this.fogGrid[game.player].length ? !0 : this.fogGrid[game.player][Math.floor(b / game.gridSize)][Math.floor(a / game.gridSize)] == 1
    },
    animate: function () {
        fog.context.globalCompositeOperation = "destination-out";
        for (var a = game.items.length - 1; a >= 0; a--) {
            var b = game.items[a];
            for (var c = game.players.length - 1; c >= 0; c--) {
                player = game.players[c];
                if (b.player == player || b.firing) {
                    var d = Math.floor(b.cgX),
                        e = Math.floor(b.cgY);
                    if (b.player == game.player) var f = d - b.sight < 0 ? 0 : d - b.sight,
                        g = e - b.sight < 0 ? 0 : e - b.sight,
                        h = d + b.sight > maps.currentMapData.width - 1 ? maps.currentMapData.width - 1 : d + b.sight,
                        i = e + b.sight > maps.currentMapData.height - 1 ? maps.currentMapData.height - 1 : e + b.sight;
                    else var f = d - 1 < 0 ? 0 : d - 1,
                        g = e - 1 < 0 ? 0 : e - 1,
                        h = d + 1 > maps.currentMapData.width - 1 ? maps.currentMapData.width - 1 : d + 1,
                        i = e + 1 > maps.currentMapData.height - 1 ? maps.currentMapData.height - 1 : e + 1;
                    for (var j = f; j <= h; j++) for (var k = g; k <= i; k++) if (j > f && j < h || k > g && k < i) game.player == player && this.fogGrid[player][k][j] && (this.context.fillStyle = "rgba(100,0,0,0.9)", this.context.beginPath(), this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 16, 0, 2 * Math.PI, !1), this.context.fill(), this.context.fillStyle = "rgba(100,0,0,0.7)", this.context.beginPath(), this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 18, 0, 2 * Math.PI, !1), this.context.fill(), this.context.fillStyle = "rgba(100,0,0,0.5)", this.context.beginPath(), this.context.arc(j * game.gridSize + 12, k * game.gridSize + 12, 24, 0, 2 * Math.PI, !1), this.context.fill()), this.fogGrid[player][k][j] = 0
                }
            }
        }
        fog.context.globalCompositeOperation = "source-over"
    },
    draw: function () {
        game.context.drawImage(this.canvas, game.viewportX, game.viewportY, game.viewportWidth, game.viewportHeight, game.viewportLeft, game.viewportTop, game.viewportWidth, game.viewportHeight)
    }
},
    fog2 = {
        fogCanvas: document.createElement("canvas"),
        isPointOverFog: function (a, b) {
            var c = this.fogContext.getImageData(a * this.scaleX, b * this.scaleY, 1, 1).data;
            return c[3] == 255
        },
        canvasWidth: undefined,
        canvasHeight: undefined,
        scaleX: 1 / 8,
        scaleY: 1 / 8,
        init: function () {
            this.canvasWidth = Math.round(maps.currentMapImage.width * this.scaleX), this.canvasHeight = Math.round(maps.currentMapImage.height * this.scaleY), this.fogCanvas.height = this.canvasHeight, this.fogCanvas.width = this.canvasWidth, this.fogCanvas.height = this.canvasHeight, this.fogContext = this.fogCanvas.getContext("2d"), this.fogContext.fillStyle = "rgba(0,0,0,1)", this.fogContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            var a = maps.currentMapImage
        },
        animate: function () {
            this.fogContext.save(), this.fogContext.scale(this.scaleX, this.scaleY), this.fogContext.fillStyle = "rgba(200,200,200,1)";
            for (var a = game.items.length - 1; a >= 0; a--) {
                var b = game.items[a];
                if (b.player == game.player || b.firing) this.fogContext.beginPath(), this.fogContext.globalCompositeOperation = "destination-out", b.player == game.player ? this.fogContext.arc(b.cgX * game.gridSize, b.cgY * game.gridSize, (b.sight + 1) * game.gridSize, 0, 2 * Math.PI, !1) : this.fogContext.arc(Math.floor(b.cgX) * game.gridSize, Math.floor(b.cgY) * game.gridSize, 2 * game.gridSize, 0, 2 * Math.PI, !1), this.fogContext.fill()
            }
            this.fogContext.restore()
        },
        draw: function () {
            game.context.drawImage(this.fogCanvas, game.viewportX * this.scaleX, game.viewportY * this.scaleX, game.viewportWidth * this.scaleX, game.viewportHeight * this.scaleY, game.viewportLeft, game.viewportTop, game.viewportWidth, game.viewportHeight)
        }
    },
    maps = {
        gdi: ["scg01ea", "scg02ea"],
        nod: ["scb01ea", "scb02ea"],
        "multi-player": ["green-acres"],
        currentMapImage: undefined,
        currentMapData: undefined,
        currentMapTerrain: undefined,
        resetGameTypes: function () {},
        load: function (a, b) {
            game.showMessage = undefined, $.ajax({
                url: "config/maps/" + a + ".js",
                dataType: "json",
                success: function (c) {
                    menus.hide(), maps.currentMapImage = preloadImage("maps/" + a + ".jpg"), maps.currentMapData = c, maps.currentMapTerrain = [];
                    for (var d = 0; d < c.height; d++) maps.currentMapTerrain[d] = Array(c.width);
                    for (var e in c.terrain) {
                        var f = c.terrain[e];
                        for (var d = f.length - 1; d >= 0; d--) maps.currentMapTerrain[f[d][1]][f[d][0]] = e
                    }
                    game.counter = 0, game.resetTypes(), game.context.fillStyle = "black", game.context.fillRect(0, 0, game.canvas.width, game.canvas.height);
                    var g = function () {
                            if (!game.loaded) {
                                setTimeout(g, 100);
                                return
                            }
                            game.start(b)
                        };
                    if (game.type == "singleplayer") {
                        game.colorHash = {
                            GoodGuy: {
                                index: 0,
                                color: "yellow",
                                team: "gdi"
                            },
                            BadGuy: {
                                index: 1,
                                color: "red",
                                team: "nod"
                            },
                            Neutral: {
                                index: 0,
                                color: "yellow",
                                team: "civilian"
                            }
                        }, game.players = ["GoodGuy", "BadGuy", "Neutral"];
                        for (var h in c.requirements) {
                            var i = c.requirements[h];
                            for (var d = 0; d < i.length; d++) {
                                var j = i[d];
                                window[h] ? window[h].load(j) : console.log("Not loading type :", h)
                            }
                        }
                        for (var h in c.starting) {
                            var k = c.starting[h];
                            for (var d = 0; d < k.length; d++) {
                                var l = k[d];
                                l.type = h, game.add(l)
                            }
                        }
                        game.team = c.team, game.viewportX = c.x * game.gridSize, game.viewportY = c.y * game.gridSize, game.player = c.player, game.cash = $.extend([], c.cash), menus.showMessageBox(c.briefing, "Mission Briefing", function () {
                            g()
                        })
                    } else {
                        var m = multiplayer.gameObject;
                        game.cash = [], game.players = [], game.colorHash = [];
                        for (var n = 0; n < m.players.length; n++) {
                            var o = m.players[n];
                            o.index = n, game.colorHash[o.userName] = o, game.players.push(o.userName), game.cash[o.userName] = m.cash
                        }
                        for (var h in c.requirements) {
                            var i = c.requirements[h];
                            for (var d = 0; d < i.length; d++) {
                                var j = i[d];
                                window[h] ? window[h].load(j) : console.log("Not loading type :", h)
                            }
                        }
                        for (var h in c.starting) {
                            var k = c.starting[h];
                            for (var d = 0; d < k.length; d++) {
                                var l = k[d];
                                l.type = h, game.add(l)
                            }
                        }
                        for (var n = 0; n < m.players.length; n++) {
                            var o = m.players[n],
                                p = c.spawns[o.spawn];
                            o.userName == game.player && (game.team = o.team, game.color = o.color, game.viewportX = p.viewportx * game.gridSize, game.viewportY = p.viewporty * game.gridSize);
                            for (var h in c.startingunits[o.team]) {
                                var k = c.startingunits[o.team][h];
                                for (var d = 0; d < k.length; d++) {
                                    var l = k[d];
                                    l.x = p.x + l.dx, l.y = p.y + l.dy, l.type = h, l.team = o.team, l.player = o.userName, game.add(l)
                                }
                            }
                        }
                        g()
                    }
                },
                error: function (a, b) {
                    menus.hide(), menus.showMessageBox(b, "Error")
                }
            })
        }
    },
    sidebar = {
        visible: !1,
        width: 160,
        iconWidth: 64,
        iconHeight: 48,
        iconList: undefined,
        canvas: undefined,
        context: undefined,
        constructing: {},
        processOrders: function (a) {
            switch (a.type) {
            case "build":
                var b = a.item;
                b.status = "building", sidebar.constructing[b.player] || (sidebar.constructing[b.player] = {});
                var c = sidebar.constructing[b.player];
                c[b.name] = b;
                break;
            case "cancel":
                var c = sidebar.constructing[a.item.player],
                    b = c[a.item.name];
                game.cash[b.player] += b.cost - b.spent, delete this.constructing[b.player][b.name];
                break;
            case "hold":
                var c = sidebar.constructing[a.item.player],
                    b = c[a.item.name];
                b.status = "hold";
                break;
            case "resume":
                var c = sidebar.constructing[a.item.player],
                    b = c[a.item.name];
                b.status = "building";
                break;
            case "deploy-building":
                var b = a.item;
                game.add(b), delete sidebar.constructing[b.player][b.name]
            }
        },
        init: function () {
            var a = ["advanced-communication-tower", "advanced-guard-tower", "advanced-power-plant", "air-strike", "airstrip", "apache", "apc", "artillery", "barbed-wire", "barracks", "chain-link", "chem-warrior", "commando", "communications-tower", "concrete-wall", "engineer", "flame-tank", "flamethrower", "grenadier", "guard-tower", "gunboat", "hand-of-nod", "harvester", "helipad", "hover-craft", "ion-cannon", "jeep", "light-tank", "mammoth-tank", "mcv", "medium-tank", "minigunner", "msamicnh", "buggy", "nuclear-strike", "obelisk", "orca", "power-plant", "recon-bike", "refinery", "repair-facility", "rocket_soldier", "sam-site", "sandbags", "ssm-launcher", "stealth-tank", "support-aircraft", "temple-of-nod", "tiberium-silo", "transport", "gun-turret", "weapons-factory", "wooden-fence"],
                b = [];
            for (var c = 0; c < a.length; c++) b[a[c]] = {
                offset: c * this.iconWidth,
                index: c,
                name: a[c]
            };
            var d = maps.currentMapData;
            this.iconList = [], this.leftButtons = [], this.rightButtons = [], this.leftButtonOffset = 0, this.rightButtonOffset = 0, this.repairMode = !1, this.sellMode = !1, this.mapMode = !1, this.deployMode = !1, this.mapEnabled = !1, this.constructing = [];
            for (var e in d.buildable) {
                var f = d.buildable[e];
                for (var c = 0; c < f.length; c++) {
                    var g = f[c],
                        h = window[e].list[g];
                    if (h.dependency) {
                        var i = {
                            name: g,
                            offset: b[g].offset,
                            type: e,
                            details: h,
                            dependency: h.dependency,
                            constructedIn: h.constructedIn,
                            owner: h.owner,
                            cost: h.cost,
                            label: h.label,
                            satisfied: !1
                        };
                        this.iconList.push(i)
                    }
                }
            }
        },
        finishDeployingBuilding: function () {
            for (var a = 0; a < game.buildings.length; a++) if (game.buildings[a].name == "construction-yard" && game.buildings[a].player == game.player) {
                game.buildings[a].status = "construct", game.buildings[a].animationIndex = 0;
                break
            }
            game.sendCommand("sidebar", {
                type: "deploy-building",
                item: {
                    name: sidebar.deployBuilding.name,
                    player: game.player,
                    team: game.team,
                    type: sidebar.deployBuilding.type,
                    x: mouse.gridX,
                    y: mouse.gridY,
                    action: "build"
                }
            }), sounds.play("construction"), sidebar.deployMode = !1;
            for (var a = this.leftButtons.length - 1; a >= 0; a--) this.leftButtons[a].status = undefined;
            sidebar.deployBuilding = null
        },
        finishDeployingUnit: function (a) {
            var b;
            for (var c = 0; c < game.buildings.length; c++) if (a.constructedIn.indexOf(game.buildings[c].name) > -1 && game.buildings[c].player == a.player) {
                b = game.buildings[c];
                if (b.primaryBuilding) break
            }
            delete sidebar.constructing[a.player][a.name];
            if (b) if (a.type == "infantry") {
                if (b.name == "barracks") {
                    var d = this.side ? .5 : 1.25,
                        e = game.obstructionGrid[b.y + 3][b.x + Math.floor(d)] ? 2.5 : 3.5;
                    game.add({
                        name: a.name,
                        type: a.type,
                        player: b.player,
                        team: b.team,
                        x: b.x + d,
                        y: b.y + 1.25,
                        direction: 4,
                        orders: {
                            type: "move",
                            to: {
                                x: b.x + d,
                                y: b.y + e
                            }
                        }
                    })
                } else {
                    var d = this.side ? .5 : 1.25,
                        e = game.obstructionGrid[b.y + 4][b.x + Math.floor(d)] ? 3.5 : 4.5;
                    game.add({
                        name: a.name,
                        type: a.type,
                        player: b.player,
                        team: b.team,
                        x: b.x + .5,
                        y: b.y + 2.5,
                        direction: 4,
                        orders: {
                            type: "move",
                            to: {
                                x: b.x + d,
                                y: b.y + e
                            }
                        }
                    })
                }
                this.side = !this.side
            } else alert("non infantry produced??? when did that happen??? :D")
        },
        powerOut: 0,
        powerIn: 0,
        powerScale: 5,
        checkPower: function () {
            this.powerOut = 0, this.powerIn = 0;
            for (var a = game.buildings.length - 1; a >= 0; a--) {
                var b = game.buildings[a];
                b.player == game.player && b.lifeCode != "ultra-damaged" && (this.powerOut += b.powerOut, this.powerIn += b.powerIn)
            }
        },
        hoveredButton: function () {
            var a = mouse.y - sidebar.top,
                b = mouse.x;
            if (a >= 165 && a <= 455) {
                var c = 0;
                for (var d = 0; d < 6; d++) if (a >= 165 + d * 48 && a <= 165 + d * 48 + 48) {
                    c = d;
                    break
                }
                var e, f, g;
                b < 500 || b > 564 ? b >= 570 && b <= 634 && (e = "right", f = this.rightButtonOffset + c, g = sidebar.rightButtons) : (e = "left", f = this.leftButtonOffset + c, g = sidebar.leftButtons);
                if (g && g.length > f) {
                    var h = g[f];
                    return h
                }
            }
        },
        isDependencySatisfied: function (a, b, c) {
            if (!a) return !1;
            for (var d = a.length - 1; d >= 0; d--) {
                var e = a[d].split("|"),
                    f = !1;
                for (var g = e.length - 1; g >= 0; g--) {
                    var h = e[g];
                    for (var i = game.buildings.length - 1; i >= 0; i--) {
                        var j = game.buildings[i];
                        if (j.player == game.player && j.name == h && (d > 0 || b == "both" || b == j.originalteam || b == j.team)) {
                            f = !0;
                            break
                        }
                    }
                }
                if (!f) return !1
            }
            return !0
        },
        checkDependencies: function () {
            var a = !1;
            for (var b = this.iconList.length - 1; b >= 0; b--) {
                var c = this.iconList[b],
                    d = c.type == "buildings" || c.type == "turrets" ? this.leftButtons : this.rightButtons;
                if (sidebar.isDependencySatisfied(c.dependency, c.owner, c.name)) c.satisfied || (c.satisfied = !0, a = !0, d.indexOf(c) > -1 && alert("wft" + c.name), d.push(c));
                else if (c.satisfied) {
                    c.satisfied = !1;
                    if (c.status != undefined && c.status != "disabled") {
                        game.sendCommand("sidebar", {
                            type: "cancel",
                            item: {
                                player: game.player,
                                type: c.type,
                                name: c.name
                            }
                        });
                        for (var b = d.length - 1; b >= 0; b--) d[b].type == c.type && (d[b].status = undefined)
                    }
                    d.remove(c)
                }
            }
            a && (sidebar.visible = !0, sounds.play("new_construction_options"))
        },
        load: function () {
            this.top = game.viewportTop - 2, this.left = game.canvas.width - this.width, this.canvas = document.createElement("canvas"), this.context = this.canvas.getContext("2d"), this.tabsImage = preloadImage("sidebar/tabs.png"), this.sidebarImage = preloadImage("sidebar/sidebar.png"), this.primaryBuildingImage = preloadImage("sidebar/primary.png"), this.readyImage = preloadImage("sidebar/ready.png"), this.holdImage = preloadImage("sidebar/hold.png"), this.placementWhiteImage = preloadImage("sidebar/placement-white.gif"), this.placementRedImage = preloadImage("sidebar/placement-red.gif"), this.powerIndicator = preloadImage("sidebar/power/power_indicator2.png"), this.repairButtonPressed = preloadImage("sidebar/buttons/repair-pressed.png"), this.sellButtonPressed = preloadImage("sidebar/buttons/sell-pressed.png"), this.repairImageBig = preloadImage("sidebar/repair-big.png"), this.repairImageSmall = preloadImage("sidebar/repair-small.png"), this.selectImageBig = preloadImage("sidebar/select-big.png"), this.selectImageSmall = preloadImage("sidebar/select-small.png"), this.iconsSpriteSheet = preloadImage("sidebar/icons-sprite-sheet.png"), this.missionAccomplished = preloadImage("sidebar/mission-accomplished.png"), this.missionFailed = preloadImage("sidebar/mission-failed.png")
        },
        leftButtonOffset: 0,
        rightButtonOffset: 0,
        disabledStyle: "rgba(200,200,200,0.6)",
        drawButtonLabel: function (a, b, c) {
            var d = this.iconWidth / 2 - a.width / 2,
                e = this.iconHeight / 2;
            game.context.globalAlpha = this.textBrightness, game.context.drawImage(a, b + d, c + e), game.context.globalAlpha = 1
        },
        drawPower: function () {
            var a = "rgba(174,52,28,0.7)",
                b = "rgba(250,100,0,0.6)",
                c = "rgba(84,252,84,0.3)",
                d = this.left,
                e = this.top + 160,
                f = 320,
                g = 20;
            this.powerOut / this.powerIn < 1.1 ? this.powerOut / this.powerIn < 1 ? this.powerOut < this.powerIn && (game.context.fillStyle = a) : game.context.fillStyle = b : game.context.fillStyle = c, game.context.fillRect(d + 8, e + f - this.powerOut / this.powerScale, g - 14, this.powerOut / this.powerScale), game.context.drawImage(this.powerIndicator, d, e + f - this.powerIn / this.powerScale)
        },
        drawButton: function (a, b) {
            var c = a == "left" ? this.leftButtons : this.rightButtons,
                d = a == "left" ? this.leftButtonOffset : this.rightButtonOffset,
                e = c[b + d],
                f = a == "left" ? 500 : 570,
                g = 165 + this.top + b * this.iconHeight;
            game.context.drawImage(sidebar.iconsSpriteSheet, e.offset, 0, this.iconWidth, this.iconHeight, f, g, this.iconWidth, this.iconHeight);
            if (e.status == "ready") this.drawButtonLabel(this.readyImage, f, g);
            else if (e.status == "disabled") game.context.fillStyle = sidebar.disabledStyle, game.context.fillRect(f, g, this.iconWidth, this.iconHeight);
            else if (e.status == "building") {
                var h = 0;
                sidebar.constructing[game.player] && sidebar.constructing[game.player][e.name] && (h = sidebar.constructing[game.player][e.name].percentComplete), sidebar.context.clearRect(0, 0, this.iconWidth, this.iconHeight), sidebar.context.fillStyle = sidebar.disabledStyle, sidebar.context.beginPath(), sidebar.context.moveTo(this.iconWidth / 2, this.iconHeight / 2), sidebar.context.arc(this.iconWidth / 2, this.iconHeight / 2, 40, Math.PI * 2 * h - Math.PI / 2, 3 * Math.PI / 2), sidebar.context.moveTo(this.iconWidth / 2, this.iconHeight / 2), sidebar.context.fill(), game.context.drawImage(sidebar.canvas, 0, 0, this.iconWidth, this.iconHeight, f, g, this.iconWidth, this.iconHeight)
            } else if (e.status == "hold") {
                var h = 0;
                sidebar.constructing[game.player] && sidebar.constructing[game.player][e.name] && (h = sidebar.constructing[game.player][e.name].percentComplete), sidebar.context.clearRect(0, 0, this.iconWidth, this.iconHeight), sidebar.context.fillStyle = sidebar.disabledStyle, sidebar.context.beginPath(), sidebar.context.moveTo(this.iconWidth / 2, this.iconHeight / 2), sidebar.context.arc(this.iconWidth / 2, this.iconHeight / 2, 40, Math.PI * 2 * h - Math.PI / 2, 3 * Math.PI / 2), sidebar.context.moveTo(this.iconWidth / 2, this.iconHeight / 2), sidebar.context.fill(), game.context.drawImage(sidebar.canvas, 0, 0, this.iconWidth, this.iconHeight, f, g, this.iconWidth, this.iconHeight), this.drawButtonLabel(this.holdImage, f, g)
            }
        },
        drawButtons: function () {
            var a = this.leftButtons.length > 6 ? 6 : this.leftButtons.length;
            for (var b = 0; b < a; b++) this.drawButton("left", b);
            var c = this.rightButtons.length > 6 ? 6 : this.rightButtons.length;
            for (var b = 0; b < c; b++) this.drawButton("right", b)
        },
        click: function (a, b) {
            var c = mouse.y - this.top,
                d = mouse.x;
            if (c < 146 || c > 160) if (c < 455 || c > 480) {
                if (c >= 165 && c <= 455) {
                    var e = 0;
                    for (var f = 0; f < 6; f++) if (c >= 165 + f * 48 && c <= 165 + f * 48 + 48) {
                        e = f;
                        break
                    }
                    var g, h, i;
                    d < 500 || d > 564 ? d >= 570 && d <= 634 && (g = "right", h = this.rightButtonOffset + e, i = this.rightButtons) : (g = "left", h = this.leftButtonOffset + e, i = this.leftButtons);
                    if (i && i.length > h) {
                        var j = i[h];
                        if (!j.status && !b) {
                            for (var f = i.length - 1; f >= 0; f--) i[f].dependency[0] == j.dependency[0] && (i[f].status = "disabled");
                            j.status = "building", sounds.play("building"), game.sendCommand("sidebar", {
                                type: "build",
                                item: {
                                    player: game.player,
                                    spent: j.cost,
                                    cost: j.cost,
                                    constructedIn: j.constructedIn,
                                    percentComplete: 0,
                                    type: j.type,
                                    name: j.name
                                }
                            })
                        } else if (j.status == "building" && !b) sounds.play("not_ready");
                        else if (j.status == "building" && b) j.status = "hold", sounds.play("on_hold"), game.sendCommand("sidebar", {
                            type: "hold",
                            item: {
                                player: game.player,
                                type: j.type,
                                name: j.name
                            }
                        });
                        else if (j.status == "hold" && !b) j.status = "building", sounds.play("building"), game.sendCommand("sidebar", {
                            type: "resume",
                            item: {
                                player: game.player,
                                type: j.type,
                                name: j.name
                            }
                        });
                        else if (j.status != "hold" && j.status != "ready" || !b) j.status == "ready" && !b ? j.type == "buildings" || j.type == "turrets" ? (sidebar.deployMode = !0, game.clearSelection(), sidebar.repairMode = !1, sidebar.sellMode = !1, sidebar.deployBuilding = j.details) : j.type != "infantry" && j.type != "vehicles" : j.status == "disabled" && sounds.play("building_in_progress");
                        else {
                            j.status = undefined, sounds.play("cancelled"), game.sendCommand("sidebar", {
                                type: "cancel",
                                item: {
                                    player: game.player,
                                    type: j.type,
                                    name: j.name
                                }
                            });
                            for (var f = i.length - 1; f >= 0; f--) i[f].type == j.type && (i[f].status = undefined)
                        }
                    }
                }
            } else d < 500 || d > 530 ? d < 532 || d > 562 ? d < 570 || d > 600 ? d >= 602 && d <= 632 && this.rightButtonOffset + 6 < this.rightButtons.length && (this.rightButtonOffset++, sounds.play("button")) : this.rightButtonOffset > 0 && (this.rightButtonOffset--, sounds.play("button")) : this.leftButtonOffset + 6 < this.leftButtons.length && (this.leftButtonOffset++, sounds.play("button")) : this.leftButtonOffset > 0 && (this.leftButtonOffset--, sounds.play("button"));
            else d < 485 || d > 530 ? d < 538 || d > 582 ? d >= 590 && d <= 635 && this.mapEnabled && (sounds.play("button"), this.mapMode = !this.mapMode, this.repairMode = !1, this.sellMode = !1, this.deployMode = !1) : (sounds.play("button"), this.sellMode = !this.sellMode, this.sellMode && game.clearSelection(), this.repairMode = !1, this.deployMode = !1) : (sounds.play("button"), this.repairMode = !this.repairMode, this.repairMode && game.clearSelection(), this.sellMode = !1, this.deployMode = !1)
        },
        textBrightness: 1,
        animate: function () {
            this.textBrightness -= .1, this.textBrightness < 0 && (this.textBrightness = 1), sidebar.checkDependencies(), sidebar.checkPower();
            for (var a in sidebar.constructing) for (var b in sidebar.constructing[a]) {
                var c = sidebar.constructing[a][b];
                if (c.status == "building") {
                    var d = 1,
                        e = 2;
                    if (e <= game.cash[c.player] || c.spent <= game.cash[c.player]) {
                        game.cash[c.player] -= e, c.spent -= e;
                        if (c.spent < 0) {
                            game.cash[c.player] -= c.spent, c.spent = 0, c.status = "ready";
                            if (c.type == "buildings" || c.type == "turrets") {
                                if (c.player == game.player) {
                                    sounds.play("construction_complete");
                                    var f = this.leftButtons,
                                        g;
                                    for (var h = f.length - 1; h >= 0; h--) {
                                        g = f[h];
                                        if (g.name == c.name) break
                                    }
                                    g.status = "ready"
                                }
                            } else if (c.type == "infantry" || c.type == "vehicles") {
                                if (c.player == game.player) {
                                    sounds.play("unit_ready");
                                    for (var h = sidebar.rightButtons.length - 1; h >= 0; h--) sidebar.rightButtons[h].type == c.type && (sidebar.rightButtons[h].status = undefined)
                                }
                                sidebar.finishDeployingUnit(c)
                            }
                        }
                        c.percentComplete = 1 - c.spent / c.cost
                    }
                }
            }
        },
        draw: function () {
            game.context.drawImage(this.tabsImage, 0, this.top - this.tabsImage.height + 2), game.context.fillStyle = "lightgreen", game.context.font = "12px Command";
            var a = (game.cash[game.player] + "").split("").join(" ");
            game.context.fillText(a, 400 - a.length * 5 / 2, 31), this.visible && (game.context.drawImage(this.sidebarImage, this.left, this.top), this.repairMode && game.context.drawImage(this.repairButtonPressed, this.left + 4, this.top + 145), this.sellMode && game.context.drawImage(this.sellButtonPressed, this.left + 57, this.top + 145), this.drawButtons(), this.drawPower())
        }
    },
    vehicles = {
        type: "vehicles",
        list: {
            buggy: {
                name: "buggy",
                label: "Nod Buggy",
                speed: 30,
                turnSpeed: 10,
                armor: 2,
                primaryWeapon: "machinegun",
                cost: 300,
                sight: 2,
                dependency: ["weapons-factory"],
                owner: "nod",
                hitPoints: 140,
                directions: 32,
                hasTurret: !0,
                deathAnimation: "frag1",
                spriteImages: [{
                    name: "move",
                    count: 32
                }, {
                    name: "turret",
                    count: 32
                }],
                pixelOffsetX: -12,
                pixelOffsetY: -12,
                selectOffsetX: -14,
                selectOffsetY: -10,
                pixelHeight: 24,
                pixelWidth: 24,
                softCollisionRadius: 7,
                hardCollisionRadius: 4
            },
            jeep: {
                name: "jeep",
                label: "Hum-vee",
                dependency: ["weapons-factory"],
                owner: "gdi",
                speed: 30,
                turnSpeed: 10,
                armor: 2,
                primaryWeapon: "machinegun",
                cost: 400,
                sight: 2,
                hitPoints: 150,
                directions: 32,
                hasTurret: !0,
                deathAnimation: "frag1",
                spriteImages: [{
                    name: "move",
                    count: 32
                }, {
                    name: "turret",
                    count: 32
                }],
                pixelOffsetX: -12,
                pixelOffsetY: -12,
                selectOffsetX: -15,
                selectOffsetY: -10,
                pixelHeight: 24,
                pixelWidth: 24,
                softCollisionRadius: 7,
                hardCollisionRadius: 4
            },
            harvester: {
                name: "harvester",
                label: "Tiberium Harvester",
                dependency: ["weapons-factory", "refinery"],
                owner: "both",
                turnSpeed: 5,
                speed: 12,
                armor: 2,
                cost: 1400,
                hitPoints: 600,
                sight: 2,
                directions: 32,
                crusher: !0,
                tiberium: 0,
                deathAnimation: "fball1",
                spriteImages: [{
                    name: "move",
                    count: 32
                }, {
                    name: "harvest-0",
                    count: 4
                }, {
                    name: "harvest-4",
                    count: 4
                }, {
                    name: "harvest-8",
                    count: 4
                }, {
                    name: "harvest-12",
                    count: 4
                }, {
                    name: "harvest-16",
                    count: 4
                }, {
                    name: "harvest-20",
                    count: 4
                }, {
                    name: "harvest-24",
                    count: 4
                }, {
                    name: "harvest-28",
                    count: 4
                }],
                pixelOffsetX: -24,
                pixelOffsetY: -24,
                selectOffsetX: -15,
                selectOffsetY: -10,
                pixelHeight: 48,
                pixelWidth: 48,
                softCollisionRadius: 8,
                hardCollisionRadius: 4,
                processOrders: function () {
                    this.lastMovementX = 0, this.lastMovementY = 0, this.weapon.cooldown > 0 && this.weapon.cooldown--;
                    switch (this.orders.type) {
                    case "stand":
                        this.action = "move";
                        break;
                    case "move":
                        this.action = "move", Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < .2 ? this.orders = {
                            type: "stand"
                        } : this.moveTo(this.orders.to);
                        break;
                    case "harvest":
                        this.action = "move", this.orders.tiberium || (this.orders.tiberium = this.findTiberiumInRange());
                        if (this.tiberium >= 10 || !this.orders.tiberium) this.orders.type = "harvest-return";
                        if (this.orders.tiberium) if (Math.pow(this.orders.tiberium.cgX - this.x, 2) + Math.pow(this.orders.tiberium.cgY - this.y, 2) < 1) {
                            var a = findAngle({
                                x: this.orders.tiberium.cgX,
                                y: this.orders.tiberium.cgY
                            }, this, this.directions),
                                b = Math.floor(a / 4) * 4 % this.directions;
                            this.direction != b ? this.turnTo(b) : this.action = "harvest-" + b
                        } else this.moveTo({
                            x: this.orders.tiberium.cgX,
                            y: this.orders.tiberium.cgY
                        });
                        break;
                    case "harvest-return":
                        this.action = "move";
                        if (!this.orders.refinery || this.orders.refinery.player != this.player) this.orders.refinery = this.findRefineryInRange();
                        if (this.orders.refinery && this.orders.refinery.lifeCode != "ultra-damaged" && this.orders.refinery.lifeCode != "dead") {
                            var c = {
                                x: this.orders.refinery.x + .25,
                                y: this.orders.refinery.y + 2.3
                            };
                            this.tiberium > 0 && Math.pow(c.x - this.x, 2) + Math.pow(c.y - this.y, 2) < .5 ? (this.x = c.x, this.y = c.y, this.direction != 14 ? this.turnTo(14) : (this.orders.refinery.orders = {
                                type: "harvest",
                                harvester: this
                            }, game.remove(this))) : this.moveTo(c)
                        }
                    }
                    this.cgX = this.x, this.cgY = this.y
                },
                findRefineryInRange: function () {
                    var a, b;
                    for (var c = 0; c < game.buildings.length; c++) {
                        var d = game.buildings[c];
                        if (d.name == "refinery" && d.player == this.player) {
                            var e = Math.pow(d.cgX - this.x, 2) + Math.pow(d.y - this.y, 2);
                            if (!b || a > e) a = e, b = d
                        }
                    }
                    return b
                },
                findTiberiumInRange: function () {
                    var a, b;
                    for (var c = 0; c < game.tiberium.length; c++) {
                        var d = game.tiberium[c];
                        if (this.player != game.player || !fog.isPointOverFog(d.cgX * game.gridSize, d.cgY * game.gridSize)) {
                            var e = Math.pow(d.cgX - this.x, 2) + Math.pow(d.cgY - this.y, 2);
                            if (!b || a > e) a = e, b = d
                        }
                    }
                    return b
                },
                animate: function () {
                    this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.imageList = this.spriteArray[this.action], this.action == "move" ? this.imageOffset = this.imageList.offset + Math.floor(this.direction) : (this.imageList || console.log(this), this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.orders.tiberium.stage--, this.tiberium++, this.orders.tiberium.stage || (this.orders.tiberium = undefined))), this.lifeCode = getLifeCode(this);
                    if (this.lifeCode == "dead") {
                        game.remove(this), game.add({
                            type: "effects",
                            name: this.deathAnimation,
                            x: this.x,
                            y: this.y
                        }), sounds.play("xplosml2");
                        return
                    }
                }
            },
            mcv: {
                name: "mcv",
                label: "Mobile Construction Vehicle",
                dependency: undefined,
                owner: "both",
                speed: 12,
                turnSpeed: 5,
                armor: 2,
                cost: 5e3,
                deathAnimation: "frag3",
                sight: 2,
                hitPoints: 600,
                directions: 32,
                spriteImages: [{
                    name: "move",
                    count: 32
                }],
                pixelOffsetX: -24,
                pixelOffsetY: -24,
                selectOffsetX: -15,
                selectOffsetY: -10,
                pixelHeight: 48,
                pixelWidth: 48,
                softCollisionRadius: 18,
                hardCollisionRadius: 5,
                animate: function () {
                    this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.imageList = this.spriteArray.move, this.imageOffset = this.imageList.offset + Math.floor(this.direction), this.lifeCode = getLifeCode(this);
                    if (this.lifeCode == "dead") {
                        game.remove(this), game.add({
                            type: "effects",
                            name: this.deathAnimation,
                            x: this.x,
                            y: this.y
                        }), sounds.play("xplosml2");
                        return
                    }
                }
            }
        },
        defaults: {
            action: "move",
            orders: {
                type: "stand"
            },
            direction: 4,
            turretDirection: 4,
            animationIndex: 0,
            selected: !1,
            path: undefined,
            lastMovementX: 0,
            lastMovementY: 0,
            spriteSheet: undefined,
            findEnemyInRange: findEnemyInRange,
            processOrders: function () {
                this.lastMovementX = 0, this.lastMovementY = 0, this.firing = !1, this.weapon.cooldown > 0 && this.weapon.cooldown--;
                switch (this.orders.type) {
                case "stand":
                case "hunt":
                case "guard":
                    var a = this.findEnemyInRange();
                    this.primaryWeapon && a && (this.orders = {
                        type: "attack",
                        to: a,
                        lastOrder: this.orders
                    });
                    break;
                case "patrol":
                    Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < .2 ? this.orders = {
                        type: "patrol",
                        from: this.orders.to,
                        to: this.orders.from
                    } : this.moveTo(this.orders.to);
                    var a = this.findEnemyInRange();
                    a && a.type != "ships" && (this.orders = {
                        type: "attack",
                        to: a,
                        lastOrder: this.orders
                    });
                    break;
                case "move":
                    Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < .2 ? this.orders = {
                        type: "stand"
                    } : (this.moveTo(this.orders.to), this.turretDirection != Math.floor(this.direction) && this.aimTo(Math.floor(this.direction)));
                    break;
                case "attack":
                    if (!this.orders.to || this.orders.to.lifeCode == "dead") {
                        this.orders.lastOrder ? this.orders = this.orders.lastOrder : this.orders = {
                            type: "guard"
                        };
                        return
                    }
                    if (Math.pow(this.orders.to.cgX - this.x, 2) + Math.pow(this.orders.to.cgY - this.y, 2) < Math.pow(this.sight + 1, 2)) {
                        var b = findAngle(this.orders.to, this, this.directions);
                        b != this.turretDirection ? this.aimTo(b) : this.weapon.cooldown <= 0 && this.weapon.fire(this, Math.round(this.turretDirection / 4) % 8, this.orders.to)
                    } else this.moveTo(this.orders.to);
                    break;
                case "deploy":
                    this.direction != 14 ? this.turnTo(14) : (game.remove(this), game.add({
                        name: "construction-yard",
                        type: "buildings",
                        x: Math.floor(this.x) - 1,
                        y: Math.floor(this.y) - 1,
                        action: "build",
                        team: this.team,
                        player: this.player
                    }), sounds.play("construction"))
                }
                this.cgX = this.x, this.cgY = this.y
            },
            drawSelection: function () {
                var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft + this.pixelOffsetX,
                    b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop + this.pixelOffsetY;
                game.context.drawImage(this.selectImage, a, b);
                var c = 4;
                game.context.beginPath(), game.context.rect(a, b - c - 3, this.pixelWidth * this.life / this.hitPoints, c), this.lifeCode == "healthy" ? game.context.fillStyle = "lightgreen" : this.lifeCode == "damaged" ? game.context.fillStyle = "yellow" : game.context.fillStyle = "red", game.context.fill(), game.context.beginPath(), game.context.strokeStyle = "black", game.context.rect(a, b - c - 3, this.pixelWidth, c), game.context.stroke(), game.debugMode && game.context.fillText(this.orders.type, a + 9, b)
            },
            draw: function () {
                this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX, this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY;
                var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a + this.pixelOffsetX, b + this.pixelOffsetY, this.pixelWidth, this.pixelHeight), this.hasTurret && game.context.drawImage(this.spriteCanvas, this.turretImageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a + this.pixelOffsetX, b + this.pixelOffsetY - 3, this.pixelWidth, this.pixelHeight), game.debugMode && (game.context.beginPath(), game.context.arc(a, b, this.softCollisionRadius, 0, Math.PI * 2, !1), game.context.stroke(), game.context.arc(a, b, this.hardCollisionRadius, 0, Math.PI * 2, !1), game.context.stroke()), this.selected && this.drawSelection()
            },
            animate: function () {
                this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.imageList = this.spriteArray.move, this.imageOffset = this.imageList.offset + this.direction, this.hasTurret && (this.turretImageList = this.spriteArray.turret, this.turretImageOffset = this.turretImageList.offset + this.turretDirection), this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead") {
                    game.remove(this), game.add({
                        type: "effects",
                        name: "frag3",
                        x: this.x,
                        y: this.y
                    }), sounds.play("xplosml2");
                    return
                }
            },
            turnTo: function (a) {
                a > this.direction && a - this.direction < this.directions / 2 || a < this.direction && this.direction - a > this.directions / 2 ? this.direction = this.direction + this.turnSpeed / 10 : this.direction = this.direction - this.turnSpeed / 10, this.direction > this.directions - 1 ? this.direction -= this.directions - 1 : this.direction < 0 && (this.direction += this.directions - 1)
            },
            aimTo: function (a) {
                a > this.turretDirection && a - this.turretDirection < this.directions / 2 || a < this.turretDirection && this.turretDirection - a > this.directions / 2 ? this.turretDirection++ : this.turretDirection--, this.turretDirection > this.directions - 1 ? this.turretDirection = 0 : this.turretDirection < 0 && (this.turretDirection = this.directions - 1)
            },
            checkCollision: checkCollision,
            moveTo: moveTo
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), $.extend(b, a), b.weapon = weapons.add({
                name: b.primaryWeapon
            }), b.percentLife ? b.life = b.hitPoints * b.percentLife : b.life = b.hitPoints, b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (c) {
                createSpriteSheetCanvas(c, b.spriteCanvas, a == "harvester" || a == "mcv" ? "colormap" : "grayscale")
            }), b.spriteArray = [], b.spriteCount = 0, b.selectImage = preloadImage("sidebar/select-" + b.pixelWidth / game.gridSize + "-" + b.pixelHeight / game.gridSize + ".png");
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    buildings = {
        type: "buildings",
        list: {
            "power-plant": {
                name: "power-plant",
                label: "Power Plant",
                cost: 300,
                powerOut: 100,
                powerIn: 0,
                sight: 2,
                hasBib: !0,
                hitPoints: 400,
                dependency: ["construction-yard"],
                owner: "both",
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 4
                }, {
                    name: "healthy",
                    count: 4
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                gridShape: [
                    [1, 0],
                    [1, 1]
                ],
                pixelWidth: 48,
                pixelHeight: 48,
                gridBuild: [
                    [1, 0],
                    [1, 1],
                    [1, 1]
                ]
            },
            "construction-yard": {
                name: "construction-yard",
                label: "Construction Yard",
                powerIn: 15,
                powerOut: 30,
                cost: 5e3,
                sight: 3,
                hitPoints: 800,
                dependency: undefined,
                hasBib: !0,
                owner: "both",
                spriteImages: [{
                    name: "build",
                    count: 32
                }, {
                    name: "damaged",
                    count: 4
                }, {
                    name: "damaged-construct",
                    count: 20
                }, {
                    name: "healthy",
                    count: 4
                }, {
                    name: "healthy-construct",
                    count: 20
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                gridShape: [
                    [1, 1, 1],
                    [1, 1, 1]
                ],
                pixelWidth: 72,
                pixelHeight: 48,
                gridBuild: [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ]
            },
            barracks: {
                name: "barracks",
                label: "Barracks",
                powerIn: 20,
                cost: 300,
                sight: 3,
                hasBib: !0,
                hitPoints: 800,
                dependency: ["construction-yard", "power-plant"],
                owner: "gdi",
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 10
                }, {
                    name: "healthy",
                    count: 10
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [1, 1],
                    [0, 0]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1],
                    [1, 1]
                ]
            },
            "tiberium-silo": {
                name: "tiberium-silo",
                label: "Tiberium Silo",
                powerIn: 10,
                cost: 150,
                sight: 2,
                hasBib: !0,
                tiberiumStorage: 1500,
                hitPoints: 150,
                dependency: ["construction-yard", "refinery"],
                owner: "both",
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 5
                }, {
                    name: "healthy",
                    count: 5
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 24,
                gridShape: [
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            refinery: {
                name: "refinery",
                label: "Tiberium Refinery",
                powerIn: 40,
                powerOut: 10,
                cost: 2e3,
                sight: 3,
                hasBib: !0,
                tiberiumStorage: 1e3,
                hitPoints: 800,
                dependency: ["construction-yard", "power-plant"],
                owner: "both",
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 12
                }, {
                    name: "damaged-docking",
                    count: 7
                }, {
                    name: "damaged-loading",
                    count: 5
                }, {
                    name: "damaged-undocking",
                    count: 6
                }, {
                    name: "healthy",
                    count: 12
                }, {
                    name: "healthy-docking",
                    count: 7
                }, {
                    name: "healthy-loading",
                    count: 5
                }, {
                    name: "healthy-undocking",
                    count: 6
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 72,
                pixelHeight: 72,
                gridShape: [
                    [0, 1, 0],
                    [1, 1, 1]
                ],
                gridBuild: [
                    [0, 1, 0],
                    [1, 1, 1],
                    [1, 1, 1]
                ]
            },
            "hand-of-nod": {
                name: "hand-of-nod",
                label: "Hand of Nod",
                powerIn: 20,
                cost: 300,
                sight: 3,
                hasBib: !0,
                hitPoints: 800,
                dependency: ["construction-yard", "power-plant"],
                owner: "nod",
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 1
                }, {
                    name: "healthy",
                    count: 1
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 72,
                gridShape: [
                    [0, 0],
                    [1, 1],
                    [0, 1]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 1],
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-20": {
                name: "civilian-building-20",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 3
                }, {
                    name: "damaged",
                    count: 3
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-21": {
                name: "civilian-building-21",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 3
                }, {
                    name: "damaged",
                    count: 3
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-22": {
                name: "civilian-building-22",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 3
                }, {
                    name: "damaged",
                    count: 3
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-23": {
                name: "civilian-building-23",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 1
                }, {
                    name: "damaged",
                    count: 1
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-24": {
                name: "civilian-building-24",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 1
                }, {
                    name: "damaged",
                    count: 1
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-25": {
                name: "civilian-building-25",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 5,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 1
                }, {
                    name: "damaged",
                    count: 1
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-26": {
                name: "civilian-building-26",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 1
                }, {
                    name: "damaged",
                    count: 1
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 24,
                gridShape: [
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1]
                ]
            },
            "civilian-building-27": {
                name: "civilian-building-27",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 3
                }, {
                    name: "damaged",
                    count: 3
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            },
            "civilian-building-30": {
                name: "civilian-building-30",
                label: "Civilian Building",
                powerIn: 0,
                powerOut: 20,
                cost: 0,
                sight: 2,
                hitPoints: 200,
                dependency: undefined,
                owner: "none",
                action: "stand",
                hasBib: !1,
                spriteImages: [{
                    name: "healthy",
                    count: 3
                }, {
                    name: "damaged",
                    count: 3
                }, {
                    name: "ultra-damaged",
                    count: 1
                }],
                pixelWidth: 48,
                pixelHeight: 48,
                gridShape: [
                    [0, 0],
                    [1, 1]
                ],
                gridBuild: [
                    [1, 1],
                    [1, 1]
                ]
            }
        },
        defaults: {
            action: "stand",
            type: "buildings",
            armor: 1,
            powerOut: 0,
            powerIn: 0,
            orders: {
                type: "stand"
            },
            animationIndex: 0,
            selected: !1,
            processOrders: function () {
                switch (this.orders.type) {
                case "sell":
                    this.animationIndex == 0 && sounds.play("sell"), this.repairing = !1, this.action = "sell";
                    break;
                case "repair":
                    this.orders = {
                        type: "stand"
                    }, this.repairing = !0, sounds.play("button");
                    break;
                case "stop-repair":
                    this.orders = {
                        type: "stand"
                    }, this.repairing = !1, sounds.play("button");
                    break;
                case "harvest":
                    this.action == "stand" && (this.animationIndex = 0, this.action = "docking")
                }
            },
            drawSelection: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.selectImage, a, b);
                var c = 4;
                game.context.beginPath(), game.context.rect(a, b - c - 3, this.pixelWidth * this.life / this.hitPoints, c), this.lifeCode == "healthy" ? game.context.fillStyle = "lightgreen" : this.lifeCode == "damaged" ? game.context.fillStyle = "yellow" : game.context.fillStyle = "red", game.context.fill(), game.context.beginPath(), game.context.strokeStyle = "black", game.context.rect(a, b - c - 3, this.pixelWidth, c), game.context.stroke()
            },
            draw: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                this.hasBib && game.context.drawImage(this.bibSpriteSheet, this.bibOffsetX, this.bibOffsetY, this.pixelWidth, 48, a, b + this.pixelHeight - 24, this.pixelWidth, 48), game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight), this.selected && this.drawSelection(), this.repairing && (game.context.globalAlpha = sidebar.textBrightness, game.context.drawImage(sidebar.repairImageBig, a + (this.pixelWidth - sidebar.repairImageBig.width) / 2, b + (this.pixelHeight - sidebar.repairImageBig.height) / 2), game.context.globalAlpha = 1)
            },
            animate: function () {
                this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead") {
                    this.imageList = this.spriteArray["ultra-damaged"], this.imageOffset = this.imageList.offset;
                    if (!this.exploding) {
                        this.exploding = !0;
                        var a = this;
                        game.remove(a), game.add({
                            type: "effects",
                            name: "fball1",
                            x: this.x + .5,
                            y: this.y + 1,
                            background: this
                        }), sounds.play("xplos")
                    }
                    return
                }
                switch (this.action) {
                case "stand":
                    this.name == "tiberium-silo" ? (this.imageList = this.spriteArray[this.lifeCode], this.imageOffset = this.imageList.offset + 0) : (this.imageList = this.spriteArray[this.lifeCode], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0));
                    break;
                case "build":
                    this.imageList = this.spriteArray.build, this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action = "stand", this.name == "refinery" && game.add({
                        name: "harvester",
                        orders: {
                            type: "harvest"
                        },
                        type: "vehicles",
                        team: this.team,
                        player: this.player,
                        direction: 14,
                        x: this.x + .25,
                        y: this.y + 2.5
                    }));
                    break;
                case "docking":
                    this.imageList = this.spriteArray[this.lifeCode + "-docking"], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action = "loading");
                    break;
                case "loading":
                    this.imageList = this.spriteArray[this.lifeCode + "-loading"], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.orders.harvester.tiberium--, game.cash[this.player] += 50, this.orders.harvester.tiberium <= 0 && (this.action = "undocking"));
                    break;
                case "undocking":
                    this.imageList = this.spriteArray[this.lifeCode + "-undocking"], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action = "stand", this.orders.harvester.orders.type = "harvest", this.orders.harvester.player = this.player, this.orders.harvester.team = this.team, game.add(this.orders.harvester), this.orders = {
                        type: "stand"
                    });
                    break;
                case "construct":
                    this.imageList = this.spriteArray[this.lifeCode + "-construct"], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action = "stand");
                    break;
                case "sell":
                    this.imageList = this.spriteArray.build, this.imageOffset = this.imageList.offset + (this.imageList.count - this.animationIndex - 1), this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, game.remove(this), game.cash[this.player] += this.cost / 2, this.action = "stand")
                }
                if (this.repairing) if (this.life < this.hitPoints) {
                    var b = 1;
                    game.cash[this.player] > b && (game.cash[this.player] -= b, this.life += b * 2 * this.hitPoints / this.cost)
                } else this.repairing = !1, this.life = this.hitPoints
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), a.percentLife ? b.life = b.hitPoints * a.percentLife : b.life = b.hitPoints, $.extend(b, a), b.cgX = b.x + b.pixelWidth / 2 / game.gridSize, b.cgY = b.y + b.gridShape.length / 2, b.softCollisionRadius = b.pixelWidth / 2, b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "colormap")
            }), b.selectImage = preloadImage("sidebar/select-" + b.pixelWidth / game.gridSize + "-" + b.pixelHeight / game.gridSize + ".png"), b.spriteArray = [], b.spriteCount = 0, b.bibSpriteSheet = preloadImage(this.type + "/bib-sprite-sheet.png"), b.bibOffsetX = (b.pixelWidth - 48) * 2, b.bibOffsetY = maps.currentMapData.theater == "desert" ? 48 : 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    menus = {
        load: function () {
            $("div#menu-container").hide();
            for (var a = this.menuDetails.length - 1; a >= 0; a--) this.menuDetails[a].image = preloadImage(this.menuDetails[a].url), this.menuDetails[a].div = $("div#" + this.menuDetails[a].name + "-menu-div")[0], $(this.menuDetails[a].div).hide(), this.menuDetails[a].load()
        },
        currentMenu: undefined,
        previousMenu: undefined,
        hide: function () {
            menus.currentMenu && (menus.currentMenu.hide(), menus.currentMenu = undefined), $("#menu-container").hide()
        },
        showMessageBox: function (a, b, c) {
            var d = menus.currentMenu;
            menus.show("message-box", {
                title: b,
                content: a,
                onclickhandler: function () {
                    menus.hide(), c && c(), d && (menus.currentMenu = d, d.show(), $("div#menu-container").show())
                }
            })
        },
        show: function (a, b) {
            b || menus.hide();
            var c;
            for (var d = this.menuDetails.length - 1; d >= 0; d--) if (this.menuDetails[d].name == a) {
                c = this.menuDetails[d];
                break
            }
            $menuDiv = $("div#" + a + "-menu-div"), $menuDiv.css({
                top: Math.round((game.canvas.height - c.height) / 2),
                left: Math.round((game.canvas.width - c.width) / 2),
                width: c.width,
                height: c.height,
                zIndex: 200
            }), $menuDiv.show(), menus.currentMenu = $menuDiv, $("div#menu-container").show(), $("div#menu-container").css({
                background: c.background,
                zIndex: 190
            }), c.onShow && c.onShow(b)
        },
        menuDetails: [{
            name: "game-type",
            url: "menu/game-type-menu.png",
            width: 307,
            height: 276,
            image: undefined,
            div: undefined,
            background: "none",
            onShow: function () {
                game.context.clearRect(0, 0, game.canvas.width, game.canvas.height)
            },
            load: function () {
                $("#game-type-menu-div #single-player-game").click(function () {
                    menus.show("select-campaign"), console.log("Single player selected...")
                }), $("#game-type-menu-div #multi-player-game").click(function () {
                    typeof now == "undefined" ? menus.showMessageBox('The multiplayer server is currently in private beta. If you would like access to the beta, please go to the <a href="http://www.facebook.com/CommandConquerHtml5" target="_blank">C&amp;C - HTML5 Facebook Page</a>. <br><br>Please try the single player levels for now. Watch this page, the <a href="http://www.facebook.com/CommandConquerHtml5/" target="_blank">C&amp;C HTML5 Facebook Page</a>, or follow my twitter feed (<a href="//twitter.com/adityarshankar" target="_blank">@adityarshankar</a>) for updates.<br><br>Thank you for your patience.', "Multiplayer Server Not Available", function () {
                        menus.show("game-type")
                    }) : menus.show("join-network-game"), console.log("Multi player selected...")
                })
            }
        }, {
            name: "select-campaign",
            url: "menu/select-campaign-menu.jpg",
            width: 640,
            height: 312,
            image: undefined,
            background: "black",
            div: undefined,
            load: function () {
                var a = $(this.div);
                $("#select-campaign-menu-div #gdi-campaign").hover(function () {
                    a.css("background-position", "0px 0px")
                }, function () {
                    a.css("background-position", "0px -312px")
                }), $("#select-campaign-menu-div #nod-campaign").hover(function () {
                    a.css("background-position", "0px -624px")
                }, function () {
                    a.css("background-position", "0px -312px")
                }), $("#select-campaign-menu-div #gdi-campaign").click(function () {
                    console.log("GDI campaign selected..."), sounds.play("gdi_selected"), singlePlayer.startCampaign("gdi")
                }), $("#select-campaign-menu-div #nod-campaign").click(function () {
                    console.log("Nod campaign selected..."), sounds.play("nod_selected"), singlePlayer.startCampaign("nod")
                })
            }
        }, {
            name: "join-network-game",
            url: "menu/join-network-game-menu.png",
            width: 573,
            height: 396,
            image: undefined,
            div: undefined,
            background: "none",
            onShow: function () {
                multiplayer.init(), $("#player-name").focus()
            },
            load: function () {
                $("#join-network-game-menu-div #join-multi-player").click(function () {
                    if (!multiplayer.loadUserDetails()) return;
                    if (!multiplayer.userDetails.currentlySelectedGame) {
                        menus.showMessageBox("Please select a game to join. <br><br>If there are no games for you to join, please try starting a new game so your friends can join.", "No Game Selected");
                        return
                    }
                    multiplayer.joinExistingGame()
                }), $("#join-network-game-menu-div #cancel-multi-player").click(function () {
                    menus.show("game-type")
                }), $("#join-network-game-menu-div #new-multi-player").click(function () {
                    if (!multiplayer.loadUserDetails()) return;
                    multiplayer.createNewGame()
                })
            }
        }, {
            name: "joined-network-game",
            url: "menu/joined-network-game-menu.png",
            width: 574,
            height: 355,
            image: undefined,
            div: undefined,
            background: "none",
            onShow: function () {
                $("#input-message-player").focus(), $("#input-message-player").css("color", multiplayer.userDetails.color), $("#sent-messages-player").html("")
            },
            load: function () {
                $("#joined-network-game-menu-div #send-message-player").click(function () {
                    multiplayer.sendMessageToPlayers($("#input-message-player").val()), $("#input-message-player").val(""), $("#input-message-player").focus()
                })
            }
        }, {
            name: "start-network-game",
            url: "menu/start-network-game-menu.png",
            width: 574,
            height: 355,
            image: undefined,
            div: undefined,
            background: "none",
            onShow: function () {
                $("#input-message-host").focus(), $("#input-message-host").css("color", multiplayer.userDetails.color), $("#sent-messages-host").html("")
            },
            load: function () {
                $("#start-network-game-menu-div #cancel-new-multi-player").click(function () {
                    multiplayer.cancelNewGame()
                }), $("#start-network-game-menu-div #send-message-host").click(function () {
                    multiplayer.sendMessageToPlayers($("#input-message-host").val()), $("#input-message-host").val(""), $("#input-message-host").focus()
                }), $("#start-network-game-menu-div #reject-player").click(function () {
                    var a = $("#setup-players").val();
                    multiplayer.rejectPlayer(a)
                }), $("#start-network-game-menu-div #start-new-multi-player").click(function () {
                    var a = {
                        cash: parseInt($("#starting-credits").val()),
                        map: $("#scenarios option:selected").val()
                    };
                    a.cash > 0 && a.cash <= 1e4 ? multiplayer.startNewGame(a) : menus.showMessageBox("Starting credits must be between 1 and 10,000", "Invalid Starting Credits")
                })
            }
        }, {
            name: "message-box",
            url: "menu/message-box.jpg",
            width: 597,
            height: 152,
            image: undefined,
            div: undefined,
            background: "none",
            onShow: function (a) {
                a.title ? $("#message-box-title").html(a.title) : $("#message-box-title").html(" "), a.content ? $("#message-box-content").html(a.content) : $("#message-box-content").html(a.content), a.onclickhandler && ($("#message-box-ok").unbind("click"), $("#message-box-ok").click(a.onclickhandler))
            },
            load: function () {}
        }]
    },
    sounds = {
        list: [],
        index: [],
        loaded: !0,
        extn: "ogg",
        load: function (a, b, c) {
            c || (c = sounds.extn);
            var d = new Audio("audio/" + b + "/" + a + "." + c);
            return d.load(), d
        },
        play: function (a) {
            if (game.debugMode) return;
            var b = this.list[a];
            b || alert("WTF. No sound called" + a);
            var c;
            if (b.length == 1) c = b[0], c.play();
            else {
                if (!this.index[a] || this.index[a] >= b.length) this.index[a] = 0;
                c = b[this.index[a]], c.play(), this.index[a]++
            }
            return c
        },
        loadAll: function () {
            var a = document.createElement("audio");
            typeof a.canPlayType == "function" && a.canPlayType("audio/ogg") !== "" && a.canPlayType("audio/ogg") !== "no" ? sounds.extn = "ogg" : typeof a.canPlayType == "function" && a.canPlayType("audio/mpeg") !== "" && a.canPlayType("audio/mpeg") !== "no" && (sounds.extn = "mp3"), this.list.building_in_progress = [this.load("building_in_progress", "voice")], this.list.insufficient_funds = [this.load("insufficient_funds", "voice")], this.list.building = [this.load("building", "voice")], this.list.on_hold = [this.load("on_hold", "voice")], this.list.cancelled = [this.load("cancelled", "voice")], this.list.cannot_deploy_here = [this.load("cannot_deploy_here", "voice")], this.list.new_construction_options = [this.load("new_construction_options", "voice")], this.list.construction_complete = [this.load("construction_complete", "voice")], this.list.not_ready = [this.load("not_ready", "voice")], this.list.reinforcements_have_arrived = [this.load("reinforcements_have_arrived", "voice")], this.list.low_power = [this.load("low_power", "voice")], this.list.unit_ready = [this.load("unit_ready", "voice")], this.list.gdi_selected = [this.load("gdi_selected", "voice")], this.list.nod_selected = [this.load("nod_selected", "voice")], this.list.gdi_building_captured = [this.load("gdi_building_captured", "voice")], this.list.nod_building_captured = [this.load("nod_building_captured", "voice")], this.list.mission_accomplished = [this.load("mission_accomplished", "voice")], this.list.mission_failure = [this.load("mission_failure", "voice")], this.list.construction = [this.load("construction", "sounds")], this.list.crumble = [this.load("crumble", "sounds")], this.list.sell = [this.load("sell", "sounds")], this.list.button = [this.load("button", "sounds")], this.list.machine_gun = [this.load("machine_gun-0", "sounds"), this.load("machine_gun-1", "sounds")], this.list.tank_fire = [this.load("tank-fire-0", "sounds"), this.load("tank-fire-1", "sounds"), this.load("tank-fire-2", "sounds"), this.load("tank-fire-3", "sounds")], this.list.vehicles_select = [this.load("ready_and_waiting", "talk"), this.load("vehicle_reporting", "talk"), this.load("awaiting_orders", "talk")], this.list.vehicles_move = [this.load("affirmative", "talk"), this.load("moving_out", "talk"), this.load("acknowledged", "talk"), this.load("over_and_out", "talk")], this.list.rocket2 = [this.load("rocket2", "sounds"), this.load("rocket2", "sounds")], this.list.tnkfire6 = [this.load("tnkfire6", "sounds"), this.load("tnkfire6", "sounds"), this.load("tnkfire6", "sounds"), this.load("tnkfire6", "sounds")], this.list.mgun2 = [this.load("mgun2", "sounds"), this.load("mgun2", "sounds"), this.load("mgun2", "sounds"), this.load("mgun2", "sounds")], this.list.mgun11 = [this.load("mgun11", "sounds"), this.load("mgun11", "sounds"), this.load("mgun11", "sounds"), this.load("mgun11", "sounds")], this.list.gun18 = [this.load("gun18", "sounds"), this.load("gun18", "sounds"), this.load("gun18", "sounds"), this.load("gun18", "sounds")], this.list.xplos = [this.load("xplos", "sounds"), this.load("xplos", "sounds"), this.load("xplos", "sounds"), this.load("xplos", "sounds")], this.list.xplobig4 = [this.load("xplobig4", "sounds"), this.load("xplobig4", "sounds"), this.load("xplobig4", "sounds"), this.load("xplobig4", "sounds")], this.list.xplobig6 = [this.load("xplobig6", "sounds"), this.load("xplobig6", "sounds"), this.load("xplobig6", "sounds"), this.load("xplobig6", "sounds")], this.list.xplosml2 = [this.load("xplosml2", "sounds"), this.load("xplosml2", "sounds"), this.load("xplosml2", "sounds"), this.load("xplosml2", "sounds")], this.list.infantry_select = [this.load("reporting", "talk"), this.load("unit_reporting", "talk"), this.load("awaiting_orders", "talk")], this.list.infantry_move = [this.load("affirmative", "talk"), this.load("yes_sir", "talk"), this.load("acknowledged", "talk"), this.load("right_away", "talk")], this.list.infantry_die = [this.load("nuyell1", "sounds"), this.load("nuyell3", "sounds"), this.load("nuyell4", "sounds"), this.load("nuyell5", "sounds")], this.list.infantry_die_fire = [this.load("yell1", "sounds"), this.load("yell1", "sounds")], this.list.music = [this.load("aoi", "ost"), this.load("befeared", "ost")]
        }
    },
    walls = {
        type: "walls",
        list: {
            sandbag: {
                name: "sandbag",
                label: "Sandbag Wall",
                cost: 50,
                hitPoints: 1,
                sight: 0,
                armor: 2,
                pixelWidth: 24,
                pixelHeight: 24,
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 32
                }, {
                    name: "healthy",
                    count: 32
                }],
                gridShape: [
                    [1]
                ],
                gridBuild: [
                    [1]
                ]
            }
        },
        defaults: {
            selected: !1,
            unselectable: !0,
            unattackable: !0,
            processOrders: function () {},
            draw: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight)
            },
            animate: function () {
                this.spriteColorOffset = 0, this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead") {
                    game.remove(this);
                    return
                }
                var a = this.y > 0 ? game.obstructionGrid[this.y - 1][this.x] == "sandbag" : !1,
                    b = this.y < game.obstructionGrid.length - 1 ? game.obstructionGrid[this.y + 1][this.x] == "sandbag" : !1,
                    c = this.x > 0 ? game.obstructionGrid[this.y][this.x - 1] == "sandbag" : !1,
                    d = this.x < game.obstructionGrid[this.y].length - 1 ? game.obstructionGrid[this.y][this.x + 1] == "sandbag" : !1;
                this.imageOffset = (this.lifeCode == "healthy" ? 0 : 16) + (a ? 1 : 0) + (d ? 2 : 0) + (b ? 4 : 0) + (c ? 8 : 0)
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), b.life = b.hitPoints, $.extend(b, a), b.cgX = b.x + b.pixelWidth / 2 / game.gridSize, b.cgY = b.y + b.pixelHeight / 2 / game.gridSize, b.softCollisionRadius = b.pixelWidth / 2, b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "colormap")
            }), b.spriteArray = [], b.spriteCount = 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    tiberium = {
        type: "tiberium",
        list: {
            tiberium: {
                name: "tiberium",
                label: "Tiberium Ore",
                pixelWidth: 24,
                pixelHeight: 24,
                spriteImages: [{
                    name: "default",
                    count: 12
                }],
                gridShape: [
                    [0]
                ],
                gridBuild: [
                    [1]
                ]
            }
        },
        defaults: {
            selected: !1,
            unselectable: !0,
            unattackable: !0,
            processOrders: function () {},
            draw: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.spriteSheet, this.stage * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight)
            },
            animate: function () {
                this.spriteColorOffset = 0;
                if (this.stage < 1) {
                    game.remove(this);
                    return
                }
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), $.extend(b, a), b.cgX = b.x + .5, b.cgY = b.y + .5, b.softCollisionRadius = b.pixelWidth / 2, b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function () {}), b.spriteArray = [], b.spriteCount = 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    infantry = {
        type: "infantry",
        list: {
            minigunner: {
                name: "minigunner",
                label: "Minigunner",
                speed: 8,
                primaryWeapon: "m16",
                cost: 100,
                sight: 1,
                hitPoints: 50,
                spriteSheet: undefined,
                directions: 8,
                dependency: ["barracks|hand-of-nod"],
                constructedIn: ["barracks", "hand-of-nod"],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fire",
                    count: 8,
                    direction: !0
                }, {
                    name: "down",
                    count: 2,
                    direction: !0
                }, {
                    name: "prone-move",
                    count: 4,
                    direction: !0
                }, {
                    name: "up",
                    count: 2,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 8,
                    totalCount: 8,
                    direction: !0
                }, {
                    name: "idle-1",
                    count: 16
                }, {
                    name: "idle-2",
                    count: 16
                }, {
                    name: "fist-combat-left",
                    count: 47
                }, {
                    name: "fist-combat-right",
                    count: 47
                }, {
                    name: "die-normal",
                    count: 8
                }, {
                    name: "die-frag",
                    count: 8
                }, {
                    name: "die-explode-close",
                    count: 8
                }, {
                    name: "die-explode-far",
                    count: 12
                }, {
                    name: "die-fire",
                    count: 18
                }, {
                    name: "wave",
                    count: 3,
                    direction: !0
                }, {
                    name: "greet",
                    count: 3,
                    direction: !0
                }, {
                    name: "salute",
                    count: 3,
                    direction: !0
                }, {
                    name: "bow",
                    count: 3,
                    direction: !0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 4,
                    direction: !0,
                    spriteCount: 144
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 4,
                hardCollisionRadius: 2,
                path: undefined
            },
            engineer: {
                name: "engineer",
                label: "Engineer",
                speed: 8,
                cost: 500,
                sight: 2,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                dependency: ["barracks|hand-of-nod"],
                constructedIn: ["barracks", "hand-of-nod"],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "down",
                    count: 2,
                    direction: !0
                }, {
                    name: "prone-move",
                    count: 4,
                    direction: !0
                }, {
                    name: "up",
                    count: 2,
                    direction: !0
                }, {
                    name: "idle-1",
                    count: 16
                }, {
                    name: "die-normal",
                    count: 8
                }, {
                    name: "die-frag",
                    count: 8
                }, {
                    name: "die-explode-close",
                    count: 8
                }, {
                    name: "die-explode-far",
                    count: 12
                }, {
                    name: "die-fire",
                    count: 18
                }, {
                    name: "wave",
                    count: 3,
                    direction: !0
                }, {
                    name: "greet",
                    count: 3,
                    direction: !0
                }, {
                    name: "salute",
                    count: 3,
                    direction: !0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 4,
                    spriteCount: 66,
                    direction: !0
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-1": {
                name: "civilian-1",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: "pistol",
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-2": {
                name: "civilian-2",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-3": {
                name: "civilian-3",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-4": {
                name: "civilian-4",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-5": {
                name: "civilian-5",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-6": {
                name: "civilian-6",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-7": {
                name: "civilian-7",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: "pistol",
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-8": {
                name: "civilian-9",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 25,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-9": {
                name: "civilian-9",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: "pistol",
                hitPoints: 5,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            },
            "civilian-10": {
                name: "civilian-10",
                label: "Civilian",
                speed: 10,
                cost: 10,
                sight: 0,
                primaryWeapon: undefined,
                hitPoints: 50,
                spriteSheet: undefined,
                directions: 8,
                constructedIn: [],
                owner: "both",
                spriteImages: [{
                    name: "stand",
                    count: 8
                }, {
                    name: "guard",
                    count: 8,
                    spriteCount: 0
                }, {
                    name: "prone",
                    count: 1,
                    totalCount: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "prone-move",
                    count: 6,
                    direction: !0,
                    spriteCount: 8
                }, {
                    name: "run",
                    count: 6,
                    direction: !0
                }, {
                    name: "fist-combat-left",
                    count: 43
                }, {
                    name: "fist-combat-right",
                    count: 42
                }, {
                    name: "idle-1",
                    count: 10
                }, {
                    name: "idle-2",
                    count: 6
                }, {
                    name: "fire",
                    count: 4,
                    direction: !0
                }, {
                    name: "prone-fire",
                    count: 4,
                    direction: !0,
                    spriteCount: 205
                }, {
                    name: "executed",
                    count: 6,
                    spriteCount: 277
                }, {
                    name: "die-normal",
                    count: 8,
                    spriteCount: 329
                }, {
                    name: "die-frag",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-close",
                    count: 8,
                    spriteCount: 337
                }, {
                    name: "die-explode-far",
                    count: 12,
                    spriteCount: 345
                }, {
                    name: "die-fire",
                    count: 18,
                    spriteCount: 357
                }],
                pixelOffsetX: -26,
                pixelOffsetY: -16,
                selectOffsetX: -17,
                selectOffsetY: -10,
                pixelHeight: 39,
                pixelWidth: 50,
                softCollisionRadius: 5,
                hardCollisionRadius: 2,
                path: undefined
            }
        },
        defaults: {
            action: "stand",
            orders: {
                type: "stand"
            },
            direction: 4,
            armor: 0,
            animationIndex: 0,
            selected: !1,
            lastMovementX: 0,
            lastMovementY: 0,
            nearCount: 0,
            turnTo: function (a) {
                a > this.direction && a - this.direction < this.directions / 2 || a < this.direction && this.direction - a > this.directions / 2 ? this.direction++ : this.direction--, this.direction > this.directions - 1 ? this.direction = 0 : this.direction < 0 && (this.direction = this.directions - 1)
            },
            checkCollision: checkCollision,
            moveTo: moveTo,
            hasReached: function () {
                return Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 9 ? this.colliding && this.nearCount++ : this.nearCount = 0, Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < .25 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 1 && this.nearCount > 10 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 4 && this.nearCount > 20 || Math.pow(this.orders.to.x - this.x, 2) + Math.pow(this.orders.to.y - this.y, 2) < 9 && this.nearCount > 30 ? (this.nearCount = 0, !0) : !1
            },
            processOrders: function () {
                this.lastMovementX = 0, this.lastMovementY = 0, this.firing = !1, this.weapon && this.weapon.cooldown > 0 && this.weapon.cooldown--, this.attacked && (this.attacked = !1, this.prone = !0, this.attackedCycles = 0), this.prone && (this.attackedCycles++, this.attackedCycles > 50 && (this.prone = !1));
                switch (this.orders.type) {
                case "die":
                    break;
                case "sticky":
                    this.prone && (this.weapon ? alert("weapon sticky" + this.name) : this.orders = {
                        type: "panic"
                    });
                    break;
                case "panic":
                    this.prone = !0, this.action = "prone-move";
                    if (!this.orders.to || this.hasReached() || !this.moveTo(this.orders.to)) this.orders.to = {
                        x: this.x + Math.random() * 3 - 1.5,
                        y: this.y + Math.random() * 3 - 1.5
                    };
                    break;
                case "area guard":
                    this.orders.to || (this.orders.to = {
                        x: this.x,
                        y: this.y
                    });
                case "guard":
                case "hunt":
                    if (this.weapon) {
                        var a = this.findEnemyInRange();
                        if (!this.orders.enemy || this.orders.enemy.lifeCode == "dead") this.orders.enemy = a
                    } else this.orders = {
                        type: "panic"
                    };
                    if (this.orders.enemy && this.weapon) if (Math.pow(this.orders.enemy.cgX - this.x, 2) + Math.pow(this.orders.enemy.cgY - this.y, 2) < Math.pow(this.weapon.range + 1, 2)) {
                        this.moving = !1;
                        var b = findAngle(this.orders.enemy, this, this.directions);
                        b != this.direction ? (this.prone ? this.action = "prone" : this.action = "guard", this.turnTo(b)) : this.weapon.cooldown <= 0 && (this.prone ? this.action = "prone-fire" : this.action = "fire", this.weapon.fire(this, this.direction, this.orders.enemy))
                    } else a && a != this.orders.enemy && (this.orders.enemy = a), this.moveTo(this.orders.enemy) && (this.moving = !0, this.prone ? this.action = "prone-move" : this.action = "run");
                    else this.orders.to && !this.hasReached() && this.moveTo(this.orders.to) ? (this.moving = !0, this.prone ? this.action = "prone-move" : this.action = "run") : (this.prone ? this.action = "prone" : this.action = "guard", this.moving = !1);
                    break;
                case "stand":
                    this.prone ? this.action = "prone" : this.action = "stand", this.moving = !1;
                    if (this.weapon) {
                        var c = this.findEnemyInRange();
                        c && (this.orders = {
                            type: "attack",
                            to: c,
                            lastOrder: {
                                type: this.orders.type
                            }
                        })
                    }
                    break;
                case "move":
                    this.moving = !0, this.hasReached() ? this.orders.lastOrder ? this.orders = this.orders.lastOrder : this.orders = {
                        type: "stand"
                    } : (this.prone ? this.action = "prone-move" : this.action = "run", this.moveTo(this.orders.to) || (this.orders = {
                        type: "stand"
                    }));
                    break;
                case "infiltrate":
                    if (this.orders.to.lifeCode == "dead" || this.orders.to.player == this.player) {
                        this.orders = {
                            type: "stand"
                        };
                        return
                    }
                    if (Math.pow(this.orders.to.cgX - this.x, 2) + Math.pow(this.orders.to.cgY - this.y, 2) < Math.pow(this.orders.to.gridShape.length / 2 + .5, 2)) {
                        this.moving = !1;
                        var b = findAngle(this.orders.to, this, this.directions);
                        b != this.direction ? (this.prone ? this.action = "prone-move" : this.action = "run", this.turnTo(b)) : (this.orders.to.team == "gdi" ? sounds.play("gdi_building_captured") : sounds.play("nod_building_captured"), this.orders.to.originalteam = this.orders.to.originalteam || this.orders.to.team, this.orders.to.player = this.player, this.orders.to.team = this.team, game.remove(this))
                    } else this.moving = !0, this.prone ? this.action = "prone-move" : this.action = "run", this.moveTo(this.orders.to) || (this.orders = {
                        type: "stand"
                    });
                    break;
                case "attack":
                    var c = this.findEnemyInRange();
                    if (!this.orders.to || this.orders.to.lifeCode == "dead") {
                        c ? this.orders = {
                            type: "attack",
                            to: c,
                            lastOrder: this.orders.lastOrder
                        } : this.orders.lastOrder ? this.orders = this.orders.lastOrder : this.orders = {
                            type: "guard"
                        };
                        return
                    }
                    if (Math.pow(this.orders.to.cgX - this.x, 2) + Math.pow(this.orders.to.cgY - this.y, 2) < Math.pow(this.weapon.range, 2)) {
                        this.moving = !1;
                        var b = findAngle(this.orders.to, this, this.directions);
                        b != this.direction ? (this.prone ? this.action = "prone" : this.action = "guard", this.turnTo(b)) : this.weapon.cooldown <= 0 && (this.prone ? this.action = "prone-fire" : this.action = "fire", this.weapon.fire(this, this.direction, this.orders.to))
                    } else this.moving = !0, this.prone ? this.action = "prone-move" : this.action = "run", this.moveTo(this.orders.to) || (this.orders.lastOrder ? this.orders = this.orders.lastOrder : this.orders = {
                        type: "stand"
                    })
                }
            },
            findEnemyInRange: findEnemyInRange,
            drawSelection: function () {
                var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft + this.selectOffsetX,
                    b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop + this.selectOffsetY;
                game.context.drawImage(this.selectImage, a, b);
                var c = 3,
                    d = 12;
                game.context.beginPath(), game.context.rect(a + 9, b - c, d * this.life / this.hitPoints, c), this.lifeCode == "healthy" ? game.context.fillStyle = "lightgreen" : this.lifeCode == "damaged" ? game.context.fillStyle = "yellow" : game.context.fillStyle = "red", game.context.fill(), game.context.beginPath(), game.context.strokeStyle = "black", game.context.rect(a + 9, b - c, d, c), game.context.stroke(), game.debugMode && game.context.fillText(this.orders.type, a + 9, b)
            },
            draw: function () {
                this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX, this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY;
                var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop;
                try {
                    game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a + this.pixelOffsetX, b + this.pixelOffsetY, this.pixelWidth, this.pixelHeight)
                } catch (c) {}
                game.debugMode && (game.context.beginPath(), game.context.arc(a, b, this.softCollisionRadius, 0, Math.PI * 2, !1), game.context.stroke(), game.context.beginPath(), game.context.arc(a, b, this.hardCollisionRadius, 0, Math.PI * 2, !1), game.context.stroke()), this.selected && this.drawSelection()
            },
            animate: function () {
                this.cgX = this.x, this.cgY = this.y, this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead" && this.orders.type != "die") {
                    this.unselectable = !0, this.selected && game.selectItem(this, !0), this.orders = {
                        type: "die"
                    }, this.action = this.infantryDeath, this.animationIndex = 0;
                    switch (this.infantryDeath) {
                    case "die-normal":
                    case "die-frag":
                    case "die-explode-close":
                    case "die-explode-far":
                        sounds.play("infantry_die");
                        break;
                    case "die-fire":
                        sounds.play("infantry_die_fire")
                    }
                }
                switch (this.action) {
                case "run":
                case "fire":
                case "prone":
                case "prone-move":
                case "prone-fire":
                case "down":
                case "up":
                    this.imageList = this.spriteArray[this.action + "-" + this.direction], this.imageList || alert("no action called : " + this.action), this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action == "up" && (this.action = "stand"), this.action == "down" && (this.action = "prone"), this.action == "fire" && (this.action = "guard"), this.action == "prone-fire" && (this.action = "prone"));
                    break;
                case "die-normal":
                case "die-frag":
                case "die-explode-close":
                case "die-explode-far":
                case "die-fire":
                    this.imageList = this.spriteArray[this.action], this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.deadCount || (this.deadCount = 0), this.deadCount++, this.animationIndex = this.imageList.count - 1, this.deadCount >= 15 && game.remove(this));
                    break;
                case "guard":
                    this.imageList = this.spriteArray.guard, this.imageList || alert(this.name), this.imageOffset = this.imageList.offset + this.direction;
                    break;
                case "stand":
                    this.imageList = this.spriteArray.stand, this.imageOffset = this.imageList.offset + this.direction;
                    break;
                default:
                    alert("no action called : " + this.action)
                }
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), a.percentLife ? b.life = b.hitPoints * a.percentLife : b.life = b.hitPoints, $.extend(b, a), b.primaryWeapon && (b.weapon = weapons.add({
                name: b.primaryWeapon
            })), b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "grayscale")
            }), b.selectImage = sidebar.selectImageSmall, b.spriteArray = [], b.spriteCount = 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].totalCount || b.spriteImages[c].count,
                    f = b.spriteImages[c].name;
                typeof b.spriteImages[c].spriteCount != "undefined" && (b.spriteCount = b.spriteImages[c].spriteCount);
                if (b.spriteImages[c].direction) for (var g = 0; g < b.directions; g++) b.spriteArray[f + "-" + g] = {
                    name: f + "-" + g,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += e;
                else typeof b.spriteImages[c].spriteCount != "undefined" && (b.spriteCount = b.spriteImages[c].spriteCount), b.spriteArray[f] = {
                    name: f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
            for (var c = 0; c < this.directions; c++) b.spriteArray["prone-" + c] = {
                name: "prone-" + c,
                count: 1,
                offset: b.spriteArray["prone-fire" + c].offset
            }
        }
    },
    mouse = {
        canvas: undefined,
        context: undefined,
        cursors: [],
        cursorCount: 0,
        panDirection: "",
        panningThreshold: 24,
        panningVelocity: 24,
        underMouse: function () {
            if (mouse.y < game.viewportTop || mouse.y > game.viewportTop + game.viewportHeight || fog.isPointOverFog(mouse.gameX, mouse.gameY)) return !1;
            for (var a = game.items.length - 1; a >= 0; a--) {
                var b = game.items[a];
                if (b.type == "buildings" || b.type == "turrets" || b.type == "walls" || b.type == "tiberium") {
                    if (b.x <= mouse.gameX / game.gridSize && b.x >= (mouse.gameX - b.pixelWidth) / game.gridSize && b.y <= mouse.gameY / game.gridSize && b.y >= (mouse.gameY - b.pixelHeight) / game.gridSize) return b
                } else if (b.lifeCode != "dead" && b.type != "trees" && Math.pow(b.x - mouse.gameX / game.gridSize, 2) + Math.pow(b.y - mouse.gameY / game.gridSize, 2) < Math.pow((b.softCollisionRadius + 4) / game.gridSize, 2)) return b
            }
            return !1
        },
        handlePanning: function () {
            var a = "";
            mouse.insideCanvas && (mouse.y > game.viewportTop + mouse.panningThreshold || mouse.y < game.viewportTop ? mouse.y < game.viewportTop + game.viewportHeight - mouse.panningThreshold || mouse.y > game.viewportTop + game.viewportHeight ? (game.viewportDeltaY = 0, a += "") : (game.viewportDeltaY = mouse.panningVelocity, a += "_bottom") : (game.viewportDeltaY = -mouse.panningVelocity, a += "_top"), mouse.x >= mouse.panningThreshold || mouse.y < game.viewportTop || mouse.y > game.viewportTop + game.viewportHeight ? mouse.x <= game.screenWidth - mouse.panningThreshold || mouse.y < game.viewportTop || mouse.y > game.viewportTop + game.viewportHeight ? (game.viewportDeltaX = 0, a += "") : (game.viewportDeltaX = mouse.panningVelocity, a += "_right") : (game.viewportDeltaX = -mouse.panningVelocity, a += "_left"));
            if (game.viewportX + game.viewportDeltaX < 0 || game.viewportX + game.viewportDeltaX + game.screenWidth + (sidebar.visible ? -sidebar.width : 0) > maps.currentMapImage.width) game.viewportDeltaX = 0;
            !sidebar.visible && game.viewportX + game.screenWidth > maps.currentMapImage.width && (game.viewportX = maps.currentMapImage.width - game.screenWidth, game.viewportDeltaX = 0);
            if (game.viewportY + game.viewportDeltaY < 0 || game.viewportY + game.viewportDeltaY + game.viewportHeight > maps.currentMapImage.height) game.viewportDeltaY = 0;
            a != "" && (game.viewportDeltaX == 0 && game.viewportDeltaY == 0 ? a = "no_pan" + a : a = "pan" + a), mouse.panDirection = a, game.viewportX += game.viewportDeltaX, game.viewportY += game.viewportDeltaY, game.viewportAdjustX = game.viewportLeft - game.viewportX, game.viewportAdjustY = game.viewportTop - game.viewportY
        },
        loadCursor: function (a, b, c, d, e) {
            !b && !c && (b = 0, c = 0), e || (e = 1), d || (d = 1), this.cursors[a] = {
                x: b,
                y: c,
                name: a,
                count: d,
                spriteOffset: this.cursorCount,
                cursorSpeed: e
            }, this.cursorCount += d
        },
        load: function () {
            mouse.spriteImage = preloadImage("cursors.png"), mouse.blankCursor = preloadImage("blank.gif"), mouse.defaultCursor = preloadImage("default-cursor.gif"), mouse.loadCursor("attack", 15, 12, 8), mouse.loadCursor("big_detonate", 15, 12, 3), mouse.loadCursor("build_command", 15, 12, 9), mouse.loadCursor("default"), mouse.loadCursor("detonate", 15, 12, 3), mouse.loadCursor("load", 15, 12, 3, 2), mouse.loadCursor("unknown"), mouse.loadCursor("unknown"), mouse.loadCursor("move", 15, 12), mouse.loadCursor("no_default"), mouse.loadCursor("no_move", 15, 12), mouse.loadCursor("no_pan_bottom", 15, 24), mouse.loadCursor("no_pan_bottom_left", 0, 24), mouse.loadCursor("no_pan_bottom_right", 30, 24), mouse.loadCursor("no_pan_left", 0, 12), mouse.loadCursor("no_pan_right", 30, 12), mouse.loadCursor("no_pan_top", 15, 0), mouse.loadCursor("no_pan_top_left", 0, 0), mouse.loadCursor("no_pan_top_right", 30, 0), mouse.loadCursor("no_repair", 15, 0), mouse.loadCursor("no_sell", 15, 12), mouse.loadCursor("pan_bottom", 15, 24), mouse.loadCursor("pan_bottom_left", 0, 24), mouse.loadCursor("pan_bottom_right", 30, 24), mouse.loadCursor("pan_left", 0, 12), mouse.loadCursor("pan_right", 30, 12), mouse.loadCursor("pan_top", 15, 0), mouse.loadCursor("pan_top_left", 0, 0), mouse.loadCursor("pan_top_right", 30, 0), mouse.loadCursor("repair", 15, 0, 24), mouse.loadCursor("select", 15, 12, 6), mouse.loadCursor("sell", 15, 12, 24)
        },
        refreshInterval: 10,
        cursorLoop: 0,
        setCursor: function () {
            mouse.cursor = mouse.cursors["default"], mouse.tooltip = undefined, this.objectUnderMouse = undefined;
            if (!game.running) return;
            if (mouse.y < game.viewportTop) mouse.cursor = mouse.cursors["default"];
            else if (mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight) {
                this.objectUnderMouse = mouse.underMouse();
                if (mouse.panDirection && mouse.panDirection != "") mouse.cursor = mouse.cursors[mouse.panDirection];
                else if (sidebar.visible && mouse.x > sidebar.left) {
                    mouse.cursor = mouse.cursors["default"];
                    var a = sidebar.hoveredButton();
                    if (a) {
                        var b = a.label,
                            c = "$" + a.cost;
                        mouse.tooltip = [b, c]
                    }
                } else if (!sidebar.deployMode) if (sidebar.repairMode) this.objectUnderMouse && this.objectUnderMouse.player == game.player && (this.objectUnderMouse.type == "buildings" || this.objectUnderMouse.type == "turrets") && this.objectUnderMouse.life < this.objectUnderMouse.hitPoints ? mouse.cursor = mouse.cursors.repair : mouse.cursor = mouse.cursors.no_repair;
                else if (sidebar.sellMode)!this.objectUnderMouse || this.objectUnderMouse.player != game.player || this.objectUnderMouse.type != "buildings" && this.objectUnderMouse.type != "turrets" ? this.cursor = this.cursors.no_sell : this.cursor = this.cursors.sell;
                else if (this.objectUnderMouse && game.selectedUnits.length == 1 && this.objectUnderMouse.selected && this.objectUnderMouse.name == "mcv" && this.objectUnderMouse.player == game.player) mouse.cursor = mouse.cursors.build_command;
                else if (this.objectUnderMouse && game.selectedHarvesters.length > 0 && this.objectUnderMouse.name == "tiberium") mouse.cursor = mouse.cursors.attack;
                else if (this.objectUnderMouse && game.selectedHarvesters.length > 0 && this.objectUnderMouse.player == game.player && this.objectUnderMouse.name == "refinery") mouse.cursor = mouse.cursors.load;
                else if (this.objectUnderMouse && game.selectedEngineers.length > 0 && this.objectUnderMouse.type == "buildings" && this.objectUnderMouse.player != game.player) mouse.cursor = mouse.cursors.load;
                else if (this.objectUnderMouse && game.selectedAttackers.length > 0 && this.objectUnderMouse.player != game.player && !this.objectUnderMouse.unattackable) mouse.cursor = mouse.cursors.attack;
                else if (this.objectUnderMouse && !this.objectUnderMouse.unselectable) mouse.cursor = mouse.cursors.select;
                else if (game.selectedUnits.length > 0) try {
                    game.foggedObstructionGrid[game.player][Math.floor(mouse.gridY)][Math.floor(mouse.gridX)] ? mouse.cursor = mouse.cursors.no_move : mouse.cursor = mouse.cursors.move
                } catch (d) {
                    console.log(mouse.gridY, mouse.gridX, game.foggedObstructionGrid)
                } else mouse.cursor = mouse.cursors["default"]
            }
            mouse.cursorLoop++, mouse.cursorLoop >= mouse.cursor.cursorSpeed * mouse.cursor.count && (mouse.cursorLoop = 0), mouse.draw()
        },
        draw: function () {
            mouse.canvas.width = mouse.canvas.width;
            if (mouse.insideCanvas) {
                var a = mouse.cursor.spriteOffset + Math.floor(mouse.cursorLoop / mouse.cursor.cursorSpeed);
                mouse.context.drawImage(mouse.spriteImage, 30 * a, 0, 30, 24, mouse.x - mouse.cursor.x, mouse.y - mouse.cursor.y, 30, 24);
                if (this.dragSelect) {
                    var b = Math.min(this.gameX, this.dragX),
                        c = Math.min(this.gameY, this.dragY),
                        d = Math.abs(this.gameX - this.dragX),
                        e = Math.abs(this.gameY - this.dragY);
                    mouse.context.strokeStyle = "white", mouse.context.strokeRect(b + game.viewportAdjustX, c + game.viewportAdjustY, d, e)
                }
                if (this.tooltip) {
                    var f = 14 * this.tooltip.length + 3,
                        g = this.tooltip[0].length * 6,
                        b = Math.round(this.x);
                    b + g > sidebar.left + sidebar.width && (b = sidebar.width + sidebar.left - g);
                    var c = Math.round(this.y + 16);
                    mouse.context.fillStyle = "black", mouse.context.fillRect(b, c, g, f), mouse.context.strokeStyle = "darkgreen", mouse.context.strokeRect(b, c, g, f), mouse.context.fillStyle = "darkgreen", mouse.context.font = "12px Command";
                    for (var h = 0; h < this.tooltip.length; h++) mouse.context.fillText(this.tooltip[h], b + 4, c + 14 + h * 14)
                }
            }
        },
        click: function (a, b) {
            if (!game.running) return;
            mouse.y <= game.viewportTop && mouse.y > game.viewportTop - 15 ? mouse.x >= 0 && mouse.x < 160 ? menus.showMessageBox("Suggestions: <br><br>1. Game Speed <br>2. Volume <br>3. Save Game <br>4. Quit Game", "No Options Yet") : (mouse.x < 320 || mouse.x >= 480) && mouse.x >= 480 && mouse.x < 640 && (sidebar.visible = !sidebar.visible) : mouse.y >= game.viewportTop && mouse.y <= game.viewportTop + game.viewportHeight && (sidebar.visible && mouse.x > sidebar.left ? sidebar.click(a, b) : game.click(a, b))
        },
        listenEvents: function () {
            var a = $(mouse.canvas);
            a.mousemove(function (b) {
                var c = a.offset();
                mouse.x = b.pageX - c.left, mouse.y = b.pageY - c.top, mouse.gameX = mouse.x + game.viewportX - game.viewportLeft, mouse.gameY = mouse.y + game.viewportY - game.viewportTop, mouse.gridX = Math.floor(mouse.gameX / game.gridSize), mouse.gridY = Math.floor(mouse.gameY / game.gridSize), mouse.buttonPressed ? game.running && (Math.abs(mouse.dragX - mouse.gameX) > 4 || Math.abs(mouse.dragY - mouse.gameY) > 4) && (mouse.dragSelect = !0) : mouse.dragSelect = !1, mouse.draw()
            }), a.click(function (a) {
                return mouse.click(a, !1), mouse.dragSelect = !1, !1
            }), a.mousedown(function (a) {
                return a.which == 1 && (mouse.buttonPressed = !0, mouse.dragX = mouse.gameX, mouse.dragY = mouse.gameY, a.preventDefault()), !1
            }), a.bind("contextmenu", function (a) {
                return mouse.click(a, !0), !1
            }), a.mouseup(function (a) {
                if (a.which == 1) {
                    if (mouse.dragSelect && !game.showMessage) {
                        a.shiftKey || game.clearSelection();
                        var b = Math.min(mouse.gameX, mouse.dragX),
                            c = Math.min(mouse.gameY, mouse.dragY),
                            d = Math.max(mouse.gameX, mouse.dragX),
                            e = Math.max(mouse.gameY, mouse.dragY);
                        for (var f = game.items.length - 1; f >= 0; f--) {
                            var g = game.items[f];
                            g.type != "buildings" && g.type != "turrets" && !g.unselectable && g.player == game.player && b <= g.x * game.gridSize && d >= g.x * game.gridSize && c <= g.y * game.gridSize && e >= g.y * game.gridSize && game.selectItem(g, a.shiftKey)
                        }
                    }
                    mouse.buttonPressed = !1
                }
                return !1
            }), a.mouseleave(function (a) {
                mouse.insideCanvas = !1, mouse.draw()
            }), a.mouseenter(function (a) {
                mouse.buttonPressed = !1, mouse.insideCanvas = !0
            }), console.log("Listening for mouse events..."), $(document).keypress(function (a) {
                game.keyPressed(a)
            })
        },
        show: function () {
            mouse.canvas = document.createElement("canvas"), mouse.canvas.width = game.canvas.width, mouse.canvas.height = game.canvas.height, mouse.context = mouse.canvas.getContext("2d");
            var a = $(mouse.canvas);
            $("#canvas-container").append(a), a.css({
                zIndex: "10"
            }), mouse.listenEvents(), mouse.setCursor()
        }
    },
    trees = {
        type: "trees",
        list: {
            "tree-01": {
                name: "tree-01",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-02": {
                name: "tree-02",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-05": {
                name: "tree-05",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-06": {
                name: "tree-06",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-07": {
                name: "tree-07",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-16": {
                name: "tree-16",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-17": {
                name: "tree-17",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "desert-tree-08": {
                name: "desert-tree-08",
                label: "Tree",
                pixelWidth: 48,
                pixelHeight: 25,
                pixelOffsetX: 0,
                pixelOffsetY: -1,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "desert-tree-18": {
                name: "desert-tree-18",
                label: "Tree",
                pixelWidth: 71,
                pixelHeight: 47,
                pixelOffsetX: -23,
                pixelOffsetY: -23,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0],
                    [1, 0]
                ],
                gridBuild: [
                    [0, 0],
                    [1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-cluster-01": {
                name: "tree-cluster-01",
                label: "Tree",
                pixelWidth: 72,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0, 0],
                    [1, 1, 0]
                ],
                gridBuild: [
                    [0, 0, 0],
                    [1, 1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-cluster-02": {
                name: "tree-cluster-02",
                label: "Tree",
                pixelWidth: 72,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0, 0],
                    [1, 1, 0]
                ],
                gridBuild: [
                    [0, 0, 0],
                    [1, 1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-cluster-03": {
                name: "tree-cluster-03",
                label: "Tree",
                pixelWidth: 72,
                pixelHeight: 48,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                gridBuild: [
                    [0, 1, 1],
                    [1, 1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-cluster-04": {
                name: "tree-cluster-04",
                label: "Tree",
                pixelWidth: 96,
                pixelHeight: 72,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 0],
                    [1, 0, 0, 0]
                ],
                gridBuild: [
                    [0, 0, 0, 0],
                    [1, 1, 1, 0],
                    [1, 0, 0, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            },
            "tree-cluster-05": {
                name: "tree-cluster-05",
                label: "Tree",
                pixelWidth: 96,
                pixelHeight: 72,
                pixelOffsetX: 0,
                pixelOffsetY: -24,
                hitPoints: 600,
                armor: 1,
                gridShape: [
                    [0, 0, 1, 0],
                    [1, 1, 1, 0],
                    [0, 1, 1, 0]
                ],
                gridBuild: [
                    [0, 0, 1, 0],
                    [1, 1, 1, 0],
                    [0, 1, 1, 0]
                ],
                spriteImages: [{
                    name: "default",
                    count: 10
                }]
            }
        },
        defaults: {
            unselectable: !0,
            unattackable: !0,
            processOrders: function () {},
            draw: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight)
            },
            animate: function () {
                this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead") {
                    game.remove(this);
                    return
                }
                this.imageOffset = 0
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), b.life = b.hitPoints, $.extend(b, a), b.cgX = b.x + b.pixelWidth / 2 / game.gridSize, b.cgY = b.y + b.pixelHeight / game.gridSize, b.softCollisionRadius = b.pixelHeight / 2, b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "colormap")
            }), b.spriteArray = [], b.spriteCount = 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    weapons = {
        list: {
            chaingun: {
                name: "chaingun",
                damage: 25,
                rateOfFire: 50,
                range: 4,
                sound: "gun8",
                muzzleFlash: "minigun-fire",
                projectile: "invisibleheavy"
            },
            pistol: {
                name: "pistol",
                damage: 1,
                rateOfFire: 20,
                range: 1.7,
                sound: "gun18",
                muzzleFlash: undefined,
                projectile: "invisible"
            },
            machinegun: {
                name: "machinegun",
                damage: 15,
                rateOfFire: 30,
                range: 4,
                sound: "mgun11",
                muzzleFlash: "minigun-fire",
                projectile: "invisible"
            },
            m16: {
                name: "m16",
                damage: 15,
                projectile: "invisible",
                rateOfFire: 20,
                range: 2,
                sound: "mgun2",
                muzzleFlash: undefined,
                fire: function (a, b, c) {
                    a.firing = !0, this.cooldown = this.rateOfFire, game.add({
                        type: "bullets",
                        name: this.projectile,
                        x: a.x,
                        y: a.y,
                        direction: b,
                        directions: a.directions,
                        target: c,
                        weapon: this
                    }), sounds.play(this.sound)
                }
            },
            grenade: {
                name: "grenade",
                projectile: "bomb",
                damage: 50,
                rateOfFire: 60,
                range: 3.25,
                sound: "toss",
                muzzleFlash: undefined
            },
            turretcannon: {
                name: "turretcannon",
                projectile: "cannon",
                damage: 40,
                rateOfFire: 60,
                range: 6,
                sound: "tnkfire6",
                muzzleFlash: undefined,
                fire: function (a, b, c) {
                    a.firing = !0, this.cooldown = this.rateOfFire, game.add({
                        type: "bullets",
                        targetDistance: this.range,
                        name: this.projectile,
                        x: a.x + .5,
                        y: a.y + .5,
                        direction: b,
                        target: c,
                        weapon: this
                    }), sounds.play(this.sound)
                }
            },
            boatmissile: {
                name: "boatmissile",
                projectile: "heatseeker2",
                damage: 60,
                rateOfFire: 35,
                range: 7.5,
                sound: "rocket2",
                muzzleFlash: undefined,
                fire: function (a, b, c) {
                    a.firing = !0, this.cooldown = this.rateOfFire;
                    var d = this,
                        e = ((a.pixelWidth - 15) * a.direction + a.pixelOffsetX) / game.gridSize,
                        f = (-15 + a.pixelOffsetY) / game.gridSize;
                    game.add({
                        type: "bullets",
                        targetDistance: d.range,
                        name: d.projectile,
                        x: a.x + e,
                        y: a.y + f,
                        direction: a.turretDirection,
                        target: c,
                        weapon: d
                    }), sounds.play(this.sound), setTimeout(function () {
                        var b = ((a.pixelWidth - 15) * a.direction + a.pixelOffsetX) / game.gridSize,
                            e = (-15 + a.pixelOffsetY) / game.gridSize;
                        game.add({
                            type: "bullets",
                            targetDistance: d.range,
                            name: d.projectile,
                            x: a.x + b,
                            y: a.y + e,
                            direction: a.turretDirection,
                            target: c,
                            weapon: d
                        }), sounds.play(d.sound)
                    }, game.animationTimeout * 5)
                }
            }
        },
        defaults: {
            cooldown: 0,
            fire: function (a, b, c) {
                a.firing = !0, this.cooldown = this.rateOfFire, game.add({
                    type: "bullets",
                    name: this.projectile,
                    targetDistance: this.range,
                    x: a.x,
                    y: a.y,
                    direction: b,
                    directions: a.directions,
                    target: c,
                    weapon: this
                }), this.muzzleFlash && game.add({
                    type: "effects",
                    name: this.muzzleFlash,
                    direction: b,
                    x: a.x,
                    y: a.y,
                    weapon: this
                }), sounds.play(this.sound)
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), $.extend(b, a), b
        }
    },
    explosionSound = {
        frag1: "xplobig4",
        frag3: "xplobig6",
        vehhit2: "xplos",
        vehhit3: "xplos"
    },
    bullets = {
        type: "bullets",
        list: {
            invisible: {
                name: "invisible",
                explosion: "piff",
                warhead: "smallarms",
                rotationSpeed: 0,
                bulletSpeed: undefined,
                innacurate: !1,
                smokeTrail: !1,
                image: undefined
            },
            invisibleheavy: {
                name: "invisibleheavy",
                explosion: "piffpiff",
                warhead: "hiexplosive",
                rotationSpeed: 0,
                bulletSpeed: undefined,
                innacurate: !1,
                smokeTrail: !1,
                image: "50cal",
                pixelWidth: 24,
                pixelHeight: 24
            },
            cannon: {
                name: "cannon",
                explosion: "vehhit3",
                warhead: "armorpiercing",
                rotationSpeed: 0,
                bulletSpeed: 100,
                count: 1,
                innacurate: !1,
                smokeTrail: !1,
                image: "120mm",
                directions: 32,
                pixelWidth: 24,
                pixelHeight: 24
            },
            heatseeker2: {
                name: "heatseeker2",
                explosion: "frag1",
                rotationSpeed: 5,
                bulletSpeed: 60,
                inaccurate: !0,
                smokeTrail: !0,
                image: "dragon",
                directions: 32,
                count: 32,
                warhead: "highexplosive",
                pixelWidth: 15,
                pixelHeight: 15
            },
            bomb: {
                name: "bomb",
                explosion: "vehhit2",
                warhead: "highexplosive",
                rotationSpeed: 0,
                bulletSpeed: 12,
                ballisticCurve: !0,
                image: "bomb",
                directions: 1,
                count: 1,
                inaccurate: !1,
                smokeTrail: !1,
                pixelWidth: 8,
                pixelHeight: 8
            }
        },
        defaults: {
            direction: 0,
            distanceTravelled: 0,
            turnTo: function (a) {
                a > this.direction && a - this.direction < this.count / 2 || a < this.direction && this.direction - a > this.count / 2 ? this.direction += this.rotationSpeed / 10 : this.direction -= this.rotationSpeed / 10, this.direction > this.count - 1 ? this.direction -= this.count - 1 : this.direction < 0 && (this.direction += this.count - 1)
            },
            animate: function () {
                var a, b;
                a = this.target.cgX, b = this.target.cgY, this.lastMovementY = 0, this.lastMovementX = 0, this.rotationSpeed ? (newDirection = findAngle({
                    x: a,
                    y: b
                }, this, this.count), this.direction != newDirection && this.turnTo(newDirection), this.offsetIndex = Math.floor(this.direction)) : this.offsetIndex = 0;
                var c = !1;
                this.bulletSpeed ? Math.pow(a - this.x, 2) + Math.pow(b - this.y, 2) < .5 && (c = !0) : (c = !0, this.x = a, this.y = b);
                if (this.bulletSpeed && !c) {
                    var d = this.bulletSpeed / game.gridSize / game.speedAdjustmentFactor,
                        e = this.direction / this.directions * 2 * Math.PI;
                    this.lastMovementX = -d * Math.sin(e), this.lastMovementY = -d * Math.cos(e);
                    var f = this.x + this.lastMovementX,
                        g = this.y + this.lastMovementY;
                    this.distanceTravelled += d, this.targetDistance -= d, this.smokeTrail && game.add({
                        type: "effects",
                        name: "smokey",
                        x: this.x,
                        y: this.y
                    }), this.x = f, this.y = g
                }
                if (c || this.targetDistance < 0) {
                    if (c) for (var h = game.items.length - 1; h >= 0; h--) {
                        var i = game.items[h],
                            j = i.cgX,
                            k = i.cgY;
                        if (Math.floor(j - this.x) < 3 && Math.floor(k - this.y) < 3) {
                            var l = Math.pow(Math.pow(j - this.x, 2) + Math.pow(k - this.y, 2), .5) * game.gridSize;
                            l > i.softCollisionRadius && (l -= i.softCollisionRadius);
                            var m = this.weapon.damage * warheads[this.warhead].damageVersusArmor[this.target.armor] / 100,
                                n = Math.pow(.5, Math.floor(l / warheads[this.warhead].spread));
                            n > .125 && (i.life -= i.prone ? m * n / 2 : m * n, i.attacked = !0, i.attackedBy = this.from, i.type == "infantry" && (i.infantryDeath = warheads[this.warhead].infantryDeath))
                        }
                    }
                    game.remove(this), game.add({
                        type: "effects",
                        name: this.explosion,
                        x: this.x,
                        y: this.y
                    }), explosionSound[this.explosion] && sounds.play(explosionSound[this.explosion])
                }
            },
            draw: function () {
                if (this.image) {
                    this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX, this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY;
                    var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft - this.pixelWidth / 2,
                        b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop - this.pixelHeight / 2;
                    game.context.drawImage(this.spriteSheet, this.offsetIndex * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight)
                }
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            $.extend(b, this.defaults), $.extend(b, this.list[c]), $.extend(b, a);
            var d = Math.pow(Math.pow(b.x - b.target.cgX, 2) + Math.pow(b.y - b.target.cgY, 2), .5) + 1;
            if (!b.targetDistance || d < b.targetDistance) b.targetDistance = d;
            return b
        },
        load: function (a) {
            var b = this.list[a];
            b.name = a, b.type = this.type, b.image && (b.spriteSheet = preloadImage(this.type + "/" + b.image + "-sprite-sheet.png"))
        },
        loadAll: function () {
            for (name in this.list) this.load(name)
        }
    },
    warheads = {
        smallarms: {
            name: "smallarms",
            spread: 2,
            wood: !1,
            walls: !1,
            infantryDeath: "die-normal",
            damageVersusArmor: [100, 50, 56.25, 25, 25, 0]
        },
        highexplosive: {
            name: "highexplosive",
            spread: 6,
            wood: !0,
            walls: !0,
            infantryDeath: "die-frag",
            damageVersusArmor: [87.5, 75, 56.25, 25, 100, 0]
        },
        armorpiercing: {
            name: "armorpiercing",
            spread: 6,
            wood: !0,
            walls: !0,
            infantryDeath: "die-explode-far",
            damageVersusArmor: [25, 75, 75, 100, 50, 0]
        },
        fire: {
            name: "fire",
            spread: 8,
            wood: !0,
            walls: !1,
            infantryDeath: "die-fire",
            damageVersusArmor: [87.5, 100, 68.75, 25, 50, 0]
        }
    },
    effects = {
        type: "effects",
        list: {
            piff: {
                imageCount: 4,
                pixelWidth: 9,
                pixelHeight: 13
            },
            piffpiff: {
                imageCount: 7,
                pixelWidth: 15,
                pixelHeight: 15
            },
            vehhit2: {
                imageCount: 22,
                pixelWidth: 21,
                pixelHeight: 17
            },
            vehhit3: {
                imageCount: 14,
                pixelWidth: 19,
                pixelHeight: 13
            },
            frag1: {
                imageCount: 14,
                pixelWidth: 45,
                pixelHeight: 33
            },
            frag3: {
                imageCount: 22,
                pixelWidth: 41,
                pixelHeight: 28
            },
            fball1: {
                imageCount: 18,
                pixelWidth: 67,
                pixelHeight: 44
            },
            smokey: {
                imageCount: 7,
                pixelWidth: 19,
                pixelHeight: 17
            },
            "minigun-fire": {
                imageCount: 6,
                pixelWidth: 18,
                pixelHeight: 17,
                directions: 8
            }
        },
        defaults: {
            animationIndex: -1,
            direction: 0,
            animate: function () {
                this.animationIndex++, this.animationIndex >= this.imageCount && (this.animationIndex = 0, game.remove(this))
            },
            draw: function () {
                this.animationIndex < 0 && (this.animationIndex = 0);
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                try {
                    game.context.drawImage(this.spriteSheet, (this.direction * this.imageCount + this.animationIndex) * this.pixelWidth, 0, this.pixelWidth, this.pixelHeight, a - this.pixelWidth / 2, b - this.pixelHeight / 2, this.pixelWidth, this.pixelHeight)
                } catch (c) {}
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), $.extend(b, a), b
        },
        load: function (a) {
            var b = this.list[a];
            b.name = a, b.type = this.type, b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png")
        },
        loadAll: function () {
            for (name in this.list) this.load(name)
        }
    },
    ships = {
        type: "ships",
        list: {
            gunboat: {
                name: "gunboat",
                label: "Gun Boat",
                speed: 8,
                turnSpeed: 1,
                armor: 3,
                primaryWeapon: "boatmissile",
                cost: 300,
                sight: 5,
                hitPoints: 700,
                direction: 0,
                directions: 2,
                turretDirection: 0,
                turretDirections: 32,
                animationIndex: 0,
                wakeAnimationIndex: 0,
                spriteImages: [{
                    name: "move-healthy-0",
                    count: 32
                }, {
                    name: "move-damaged-0",
                    count: 32
                }, {
                    name: "move-ultra-damaged-0",
                    count: 32
                }, {
                    name: "move-healthy-1",
                    count: 32
                }, {
                    name: "move-damaged-1",
                    count: 32
                }, {
                    name: "move-ultra-damaged-1",
                    count: 32
                }],
                pixelOffsetX: -25,
                pixelOffsetY: -10,
                pixelHeight: 19,
                pixelWidth: 51,
                wakePixelHeight: 8,
                wakePixelWidth: 85,
                softCollisionRadius: 25,
                animate: function () {
                    this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.lifeCode = getLifeCode(this);
                    if (this.lifeCode == "dead") {
                        game.remove(this), game.add({
                            type: "effects",
                            name: "frag3",
                            x: this.x + .5,
                            y: this.y + .5
                        }), sounds.play("xplosml2");
                        return
                    }
                    this.imageList = this.spriteArray["move-" + this.lifeCode + "-" + this.direction];
                    var a = Math.round(this.turretDirection);
                    a >= this.turretDirections && (a -= this.turretDirections), this.imageOffset = this.imageList.offset + a, this.wakeImageList = this.wakeSpriteArray["wake-" + (1 - this.direction)], this.wakeImageOffset = this.wakeImageList.offset + this.wakeAnimationIndex, this.wakeAnimationIndex++, this.wakeAnimationIndex >= this.wakeImageList.count && (this.wakeAnimationIndex = 0), this.cgX = this.x, this.cgY = this.y
                },
                draw: function () {
                    this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX, this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY;
                    var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft,
                        b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop,
                        c = (this.pixelWidth - this.wakePixelWidth) / 2,
                        d = this.pixelHeight - this.wakePixelHeight;
                    game.context.drawImage(this.wakeSpriteSheet, this.wakeImageOffset * this.wakePixelWidth, 0, this.wakePixelWidth, this.wakePixelHeight, a + this.pixelOffsetX + c, b + this.pixelOffsetY + d, this.wakePixelWidth, this.wakePixelHeight), game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a + this.pixelOffsetX, b + this.pixelOffsetY, this.pixelWidth, this.pixelHeight), this.selected && this.drawSelection()
                },
                processOrders: function () {
                    this.lastMovementY = 0, this.lastMovementX = 0;
                    switch (this.orders.type) {
                    case "patrol":
                        Math.abs(this.x - this.orders.to.x) < .5 ? this.orders = {
                            type: "patrol",
                            from: this.orders.to,
                            to: this.orders.from
                        } : this.moveTo(this.orders.to), this.weapon.cooldown > 0 && (this.weapon.cooldown = this.weapon.cooldown - 1);
                        var a = this.findEnemyInRange();
                        if (a) {
                            var b = findAngle(a, this, this.turretDirections);
                            Math.abs(angleDiff(this.turretDirection, b)) > 4 && this.aimTo(b)
                        }
                        a && this.weapon.cooldown <= 0 && Math.abs(angleDiff(this.turretDirection, b)) < 8 && this.weapon.fire(this, this.animationIndex, a)
                    }
                },
                drawSelection: function () {
                    var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft + this.pixelOffsetX,
                        b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop + this.pixelOffsetY;
                    game.context.drawImage(this.selectImage, a, b);
                    var c = 4;
                    game.context.beginPath(), game.context.rect(a, b - c - 3, this.pixelWidth * this.life / this.hitPoints, c), this.lifeCode == "healthy" ? game.context.fillStyle = "lightgreen" : this.lifeCode == "damaged" ? game.context.fillStyle = "yellow" : game.context.fillStyle = "red", game.context.fill(), game.context.beginPath(), game.context.strokeStyle = "black", game.context.rect(a, b - c - 3, this.pixelWidth, c), game.context.stroke(), game.debugMode && game.context.fillText(this.orders.type, a + 9, b)
                },
                findEnemyInRange: findEnemyInRange,
                moveTo: function (a) {
                    var b = this,
                        c = a;
                    if (Math.abs(b.x - c.x) > .5) {
                        var d = b.x < c.x ? 1 : 0;
                        if (this.direction != d) this.direction = d;
                        else {
                            var e = this.speed / game.gridSize / game.speedAdjustmentFactor;
                            this.lastMovementX = this.direction == 0 ? -e : e, this.x = this.x + this.lastMovementX
                        }
                    }
                }
            },
            hovercraft: {
                name: "hovercraft",
                label: "Hovercraft",
                speed: 30,
                turnSpeed: 127,
                armor: 2,
                unselectable: !0,
                cargo: [],
                cost: 300,
                sight: 3,
                hitPoints: 400,
                directions: 4,
                spriteImages: [{
                    name: "move",
                    count: 1,
                    direction: !0
                }],
                pixelOffsetX: -24,
                pixelOffsetY: -24,
                pixelHeight: 48,
                pixelWidth: 48,
                softCollisionRadius: 24,
                animate: function () {
                    this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.imageList = this.spriteArray["move-" + this.direction], this.imageOffset = this.imageList.offset;
                    for (var a = this.cargo.length - 1; a >= 0; a--) {
                        var b = this.cargo[a];
                        switch (b.type) {
                        case "infantry":
                            b.x = this.x + Math.floor(a / 2) / 2 - .25, b.y = this.y + a % 2 / 2 - .25, b.hitPoints || (b = infantry.add(b), b.direction = Math.floor(this.direction * b.directions / this.directions), this.cargo[a] = b), b.animate();
                            break;
                        case "vehicles":
                            b.x = this.x, b.y = this.y, b.hitPoints || (b = vehicles.add(b), b.direction = Math.floor(this.direction * b.directions / this.directions), b.turretDirection = Math.floor(this.direction * b.directions / this.directions), this.cargo[a] = b), b.animate()
                        }
                    }
                    this.cgX = this.x, this.cgY = this.y
                },
                draw: function () {
                    this.interpolatedX = this.x + game.movementInterpolationFactor * this.lastMovementX, this.interpolatedY = this.y + game.movementInterpolationFactor * this.lastMovementY;
                    var a = Math.round(this.interpolatedX * game.gridSize) - game.viewportX + game.viewportLeft,
                        b = Math.round(this.interpolatedY * game.gridSize) - game.viewportY + game.viewportTop;
                    game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a + this.pixelOffsetX, b + this.pixelOffsetY, this.pixelWidth, this.pixelHeight);
                    for (var c = this.cargo.length - 1; c >= 0; c--) {
                        var d = this.cargo[c];
                        d.draw && (d.lastMovementY = this.lastMovementY, d.lastMovementX = this.lastMovementX, d.draw())
                    }
                },
                processOrders: function () {
                    this.lastMovementY = 0, this.lastMovementX = 0;
                    switch (this.orders.type) {
                    case "unload":
                        if (Math.abs(this.x - this.orders.to.x) < .5 && Math.abs(this.y - this.orders.to.y) < .5) {
                            if (this.cargo.length > 0) for (var a = this.cargo.length - 1; a >= 0; a--) {
                                var b = this.cargo.pop();
                                b.lastMovementY = this.lastMovementY, b.lastMovementX = this.lastMovementX, b.orders = {
                                    type: "move",
                                    to: {
                                        x: b.x,
                                        y: b.y - 3
                                    }
                                }, game.add(b)
                            }
                            var c = this,
                                d = this.orders.from;
                            setTimeout(function () {
                                c.orders = {
                                    type: "return",
                                    to: d
                                }
                            }, 2500)
                        } else this.moveTo(this.orders.to);
                        break;
                    case "return":
                        Math.abs(this.x - this.orders.to.x) < .5 && Math.abs(this.y - this.orders.to.y) < .5 ? game.remove(this) : this.moveTo(this.orders.to)
                    }
                },
                moveTo: function (a) {
                    var b = this,
                        c = a;
                    if (Math.abs(b.x - c.x) > .5 || Math.abs(this.y - this.orders.to.y) > .5) {
                        b.x < c.x ? newDirection = 3 : b.x > c.x ? newDirection = 1 : b.y < c.y ? newDirection = 2 : b.y > c.y && (newDirection = 0);
                        if (this.direction != newDirection) this.direction = newDirection;
                        else {
                            var d = this.speed / game.gridSize / game.speedAdjustmentFactor;
                            this.lastMovementX = this.direction == 1 ? -d : this.direction == 3 ? d : 0, this.lastMovementY = this.direction == 0 ? -d : this.direction == 2 ? d : 0, this.x = this.x + this.lastMovementX, this.y = this.y + this.lastMovementY
                        }
                    } else console.log("Reached close to destination", b, c)
                }
            }
        },
        defaults: {
            lastMovementX: 0,
            lastMovementY: 0,
            direction: 0,
            selected: !1,
            path: undefined,
            spriteSheet: undefined,
            aimTo: function (a) {
                a > this.turretDirection && a - this.turretDirection < this.turretDirections / 2 || a < this.turretDirection && this.turretDirection - a > this.turretDirections / 2 ? this.turretDirection += this.turnSpeed / 10 : this.turretDirection -= this.turnSpeed / 10, this.turretDirection > this.turretDirections - 1 ? this.turretDirection -= this.turretDirections - 1 : this.turretDirection < 0 && (this.turretDirection += this.turretDirections - 1)
            },
            turnTo: function (a) {
                a > this.direction && a - this.direction < this.directions / 2 || a < this.direction && this.direction - a > this.directions / 2 ? this.direction = this.direction + this.turnSpeed / 10 : this.direction = this.direction - this.turnSpeed / 10, this.direction > this.directions - 1 ? this.direction -= this.directions - 1 : this.direction < 0 && (this.direction += this.directions - 1)
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), a.percentLife ? b.life = b.hitPoints * a.percentLife : b.life = b.hitPoints, $.extend(b, a), b.weapon = weapons.add({
                name: b.primaryWeapon
            }), b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "colormap")
            }), b.spriteArray = [], b.spriteCount = 0, a == "gunboat" && (b.wakeSpriteSheet = preloadImage(this.type + "/gunboat-wake-sprite-sheet.png"), b.wakeSpriteArray = {
                "wake-0": {
                    name: "wake-0",
                    count: 6,
                    offset: 0
                },
                "wake-1": {
                    name: "wake-1",
                    count: 6,
                    offset: 6
                }
            }, b.selectImage = preloadImage("sidebar/select-2-1.png"));
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    turrets = {
        type: "turrets",
        list: {
            "gun-turret": {
                name: "gun-turret",
                label: "Gun Turret",
                powerIn: 20,
                primaryWeapon: "turretcannon",
                cost: 600,
                hitPoints: 400,
                sight: 5,
                turnSpeed: 5,
                armor: 3,
                directions: 32,
                dependency: ["construction-yard"],
                owner: "nod",
                pixelWidth: 24,
                pixelHeight: 24,
                selectOffsetX: -3,
                selectOffsetY: 1,
                spriteImages: [{
                    name: "build",
                    count: 20
                }, {
                    name: "damaged",
                    count: 32
                }, {
                    name: "healthy",
                    count: 32
                }],
                gridShape: [
                    [1]
                ],
                gridBuild: [
                    [1]
                ]
            }
        },
        defaults: {
            action: "guard",
            type: "turrets",
            animationIndex: 0,
            direction: 0,
            selected: !1,
            turnTo: function (a) {
                a > this.direction && a - this.direction < this.directions / 2 || a < this.direction && this.direction - a > this.directions / 2 ? this.direction = this.direction + this.turnSpeed / 10 : this.direction = this.direction - this.turnSpeed / 10, this.direction > this.directions - 1 ? this.direction -= this.directions - 1 : this.direction < 0 && (this.direction += this.directions - 1)
            },
            findEnemyInRange: findEnemyInRange,
            processOrders: function () {
                this.firing = !1;
                var a = this.findEnemyInRange();
                if (a) {
                    var b = findAngle(a, {
                        x: this.x + .5,
                        y: this.y + .5
                    }, this.directions);
                    this.turnTo(b)
                }
                a && this.weapon.cooldown <= 0 ? this.direction == b && this.weapon.fire(this, this.direction, a) : this.weapon.cooldown--
            },
            drawSelection: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.selectImage, a, b);
                var c = 4;
                game.context.beginPath(), game.context.rect(a, b - c - 3, this.pixelWidth * this.life / this.hitPoints, c), this.lifeCode == "healthy" ? game.context.fillStyle = "lightgreen" : this.lifeCode == "damaged" ? game.context.fillStyle = "yellow" : game.context.fillStyle = "red", game.context.fill(), game.context.beginPath(), game.context.strokeStyle = "black", game.context.rect(a, b - c - 3, this.pixelWidth, c), game.context.stroke()
            },
            draw: function () {
                var a = Math.round(this.x * game.gridSize) - game.viewportX + game.viewportLeft,
                    b = Math.round(this.y * game.gridSize) - game.viewportY + game.viewportTop;
                game.context.drawImage(this.spriteCanvas, this.imageOffset * this.pixelWidth, this.spriteColorOffset, this.pixelWidth, this.pixelHeight, a, b, this.pixelWidth, this.pixelHeight), this.selected && this.drawSelection()
            },
            animate: function () {
                this.spriteColorOffset = game.colorHash[this.player].index * this.pixelHeight, this.lifeCode = getLifeCode(this);
                if (this.lifeCode == "dead") {
                    game.remove(this), game.add({
                        type: "effects",
                        name: "frag3",
                        x: this.x + .5,
                        y: this.y + .5
                    }), sounds.play("xplosml2");
                    return
                }
                switch (this.action) {
                case "guard":
                    this.imageList = this.lifeCode == "healthy" ? this.spriteArray.healthy : this.spriteArray.damaged, this.imageOffset = this.imageList.offset + Math.round(this.direction);
                    break;
                case "build":
                    this.imageList = this.spriteArray.build, this.imageOffset = this.imageList.offset + this.animationIndex, this.animationIndex++, this.animationIndex >= this.imageList.count && (this.animationIndex = 0, this.action = "guard")
                }
            }
        },
        add: function (a) {
            var b = {},
                c = a.name;
            return $.extend(b, this.defaults), $.extend(b, this.list[c]), a.percentLife ? b.life = b.hitPoints * a.percentLife : b.life = b.hitPoints, $.extend(b, a), b.cgX = b.x + .5, b.cgY = b.y + .5, b.softCollisionRadius = b.pixelWidth / 2, b.weapon = weapons.add({
                name: b.primaryWeapon
            }), b
        },
        load: function (a) {
            console.log("Loading", a, "...");
            var b = this.list[a];
            b.type = this.type, b.spriteCanvas = document.createElement("canvas"), b.spriteSheet = preloadImage(this.type + "/" + a + "-sprite-sheet.png", function (a) {
                createSpriteSheetCanvas(a, b.spriteCanvas, "colormap")
            }), b.selectImage = preloadImage("sidebar/select-" + b.pixelWidth / game.gridSize + "-" + b.pixelHeight / game.gridSize + ".png"), b.spriteArray = [], b.spriteCount = 0;
            for (var c = 0; c < b.spriteImages.length; c++) {
                var d = b.spriteImages[c].count,
                    e = b.spriteImages[c].name;
                if (b.spriteImages[c].direction) for (var f = 0; f < b.directions; f++) b.spriteArray[e + "-" + f] = {
                    name: e + "-" + f,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d;
                else b.spriteArray[e] = {
                    name: e,
                    count: d,
                    offset: b.spriteCount
                }, b.spriteCount += d
            }
        }
    },
    game = {
        debugMode: !1,
        canvas: undefined,
        context: undefined,
        screenWidth: undefined,
        screenHeight: undefined,
        viewportX: 0,
        viewportY: 0,
        viewportTop: 35,
        viewportLeft: 0,
        viewportDeltaX: 0,
        viewportDeltaY: 0,
        gridSize: 24,
        gameMode: "SCREEN",
        loadedCount: 0,
        preloadCount: 0,
        loaded: !0,
        selectedItems: [],
        selectedUnits: [],
        selectedAttackers: [],
        selectedHarvesters: [],
        selectedEngineers: [],
        selectItem: function (a, b) {
            if (b && a.selected) {
                a.selected = !1, this.selectedItems.remove(a), this.selectedUnits.remove(a), this.selectedAttackers.remove(a), this.selectedHarvesters.remove(a), this.selectedEngineers.remove(a);
                return
            }
            a.selected = !0, this.selectedItems.push(a), a.type != "buildings" && a.type != "turrets" && a.type != "ships" && a.player == game.player && (this.selectedUnits.push(a), sounds.play(a.type + "_select"), a.primaryWeapon && this.selectedAttackers.push(a), a.name == "harvester" && this.selectedHarvesters.push(a), a.name == "engineer" && this.selectedEngineers.push(a))
        },
        selectionArrays: ["selectedItems", "selectedUnits", "selectedAttackers", "selectedHarvesters", "selectedEngineers"],
        clearSelection: function () {
            for (var a = this.selectedItems.length - 1; a >= 0; a--) this.selectedItems[a].selected = !1, this.selectedItems.splice(a, 1);
            for (var b = game.selectionArrays.length - 1; b >= 0; b--) game[game.selectionArrays[b]].length = 0
        },
        click: function (a, b) {
            var c = mouse.objectUnderMouse;
            if (b) {
                this.clearSelection(), sidebar.repairMode = !1, sidebar.deployMode = !1, sidebar.sellMode = !1;
                return
            }
            if (sidebar.deployMode) sidebar.canBuildHere ? sidebar.finishDeployingBuilding() : sounds.play("cannot_deploy_here");
            else if (!b && !mouse.dragSelect) if (c && mouse.cursor == mouse.cursors["build_command"]) game.sendCommand(c, {
                type: "deploy"
            });
            else if (c && mouse.cursor == mouse.cursors["sell"] && c.orders.type != "sell") game.sendCommand(c, {
                type: "sell"
            });
            else if (c && mouse.cursor == mouse.cursors["repair"]) c.repairing ? game.sendCommand(c, {
                type: "stop-repair"
            }) : game.sendCommand(c, {
                type: "repair"
            });
            else if (c && game.selectedEngineers.length > 0 && mouse.cursor == mouse.cursors["load"]) for (var d = game.selectedEngineers.length - 1; d >= 0; d--) game.sendCommand(game.selectedEngineers[d], {
                type: "infiltrate",
                uidto: c.uid
            });
            else if (c && game.selectedHarvesters.length > 0 && c.name == "tiberium") for (var d = game.selectedHarvesters.length - 1; d >= 0; d--) {
                var e = game.selectedHarvesters[d].orders.refinery ? game.selectedHarvesters[d].orders.refinery : null;
                game.sendCommand(game.selectedHarvesters[d], {
                    type: "harvest",
                    uidtiberium: c.uid,
                    uidrefinery: e
                })
            } else if (c && game.selectedHarvesters.length > 0 && c.player == game.player && c.name == "refinery") for (var d = game.selectedHarvesters.length - 1; d >= 0; d--) {
                var f = game.selectedHarvesters[d].orders.tiberium ? game.selectedHarvesters[d].orders.tiberium : null;
                game.sendCommand(game.selectedHarvesters[d], {
                    type: "harvest-return",
                    uidrefinery: c.uid,
                    uidtiberium: f
                })
            } else if (c && game.selectedAttackers.length > 0 && mouse.objectUnderMouse.player != game.player && !mouse.objectUnderMouse.unattackable) for (var d = game.selectedAttackers.length - 1; d >= 0; d--) game.sendCommand(game.selectedAttackers[d], {
                type: "attack",
                uidto: c.uid
            });
            else if (c && !c.unselectable) a.shiftKey || this.clearSelection(), c.unselectable || this.selectItem(c, a.shiftKey);
            else if (this.selectedUnits.length > 0 && !game.foggedObstructionGrid[game.player][Math.floor(mouse.gridY)][Math.floor(mouse.gridX)]) for (var d = game.selectedUnits.length - 1; d >= 0; d--) game.sendCommand(game.selectedUnits[d], {
                type: "move",
                to: {
                    x: mouse.gridX,
                    y: mouse.gridY
                }
            })
        },
        vehicles: [],
        ships: [],
        infantry: [],
        buildings: [],
        turrets: [],
        effects: [],
        bullets: [],
        walls: [],
        items: [],
        trees: [],
        tiberium: [],
        counter: 0,
        resetTypes: function () {
            this.vehicles = [], this.ships = [], this.infantry = [], this.buildings = [], this.turrets = [], this.effects = [], this.bullets = [], this.walls = [], this.items = [], this.trees = [], this.tiberium = [], this.triggers = []
        },
        getItemFromUid: function (a) {
            for (var b = game.items.length - 1; b >= 0; b--) if (a == game.items[b].uid) return game.items[b];
            return
        },
        receiveCommand: function (a, b) {
            if (a == "sidebar") {
                sidebar.processOrders(b);
                return
            }
            b.to = b.uidto ? game.getItemFromUid(b.uidto) : b.to, b.refinery = b.uidrefinery ? game.getItemFromUid(b.uidrefinery) : undefined, b.tiberium = b.uidtiberium ? game.getItemFromUid(b.uidtiberium) : undefined;
            for (var c = game.items.length - 1; c >= 0; c--) if (game.items[c].uid == a) {
                switch (game.items[c].type) {
                case "infantry":
                    game.items[c].orders = b;
                    break;
                case "vehicles":
                    game.items[c].orders = b, game.items[c].animationIndex = 0;
                    break;
                case "buildings":
                    game.items[c].orders = b, b.type == "sell" && (game.items[c].animationIndex = 0)
                }
                return
            }
        },
        sendCommand: function (a, b) {
            var c;
            if (a == "sidebar") c = "sidebar";
            else {
                c = a.uid;
                switch (a.type) {
                case "infantry":
                    sounds.play("infantry_move");
                    break;
                case "vehicles":
                    sounds.play("vehicles_move")
                }
            }
            switch (game.type) {
            case "singleplayer":
                singlePlayer.sendCommand({
                    uid: c,
                    orders: b
                });
                break;
            case "multi-player":
                multiplayer.sendCommand({
                    uid: c,
                    orders: b
                })
            }
        },
        remove: function (a) {
            a.lifeCode = "dead", a.type || console.log(a), a.selected = !1;
            for (var b = game.items.length - 1; b >= 0; b--) if (game.items[b].uid == a.uid) {
                game.items.splice(b, 1);
                break
            }
            for (var c = game.selectionArrays.length - 1; c >= 0; c--) {
                var d = game.selectionArrays[c];
                for (var b = game[d].length - 1; b >= 0; b--) if (game[d][b].uid == a.uid) {
                    game[d].splice(b, 1);
                    break
                }
            }
            for (var c = game.controlGroups.length - 1; c >= 0; c--) {
                var e = game.controlGroups[c];
                for (var b = e.length - 1; b >= 0; b--) if (e[b].uid == a.uid) {
                    e.splice(b, 1);
                    break
                }
            }
            for (var b = game[a.type].length - 1; b >= 0; b--) if (game[a.type][b].uid == a.uid) {
                game[a.type].splice(b, 1);
                break
            }
            if (
            a.type == "buildings" || a.type == "turrets" || a.type == "walls") game.buildingLandscapeChanged = !0
        },
        add: function (a) {
            var b;
            a.uid = game.counter++;
            if (a.type == "buildings" || a.type == "turrets" || a.type == "walls") game.buildingLandscapeChanged = !0;
            switch (a.type) {
            case "infantry":
                b = infantry.add(a), this.infantry.push(b), game.items.push(b);
                break;
            case "vehicles":
                b = vehicles.add(a), this.vehicles.push(b), game.items.push(b);
                break;
            case "ships":
                b = ships.add(a), this.ships.push(b), game.items.push(b);
                break;
            case "buildings":
                b = buildings.add(a), this.buildings.push(b), game.items.push(b);
                break;
            case "turrets":
                b = turrets.add(a), this.turrets.push(b), game.items.push(b);
                break;
            case "walls":
                b = walls.add(a), this.walls.push(b), game.items.push(b);
                break;
            case "trees":
                b = trees.add(a), this.trees.push(b), game.items.push(b);
                break;
            case "triggers":
                b = triggers.add(a), this.triggers.push(b);
                break;
            case "effects":
                b = effects.add(a), this.effects.push(b);
                break;
            case "bullets":
                b = bullets.add(a), this.bullets.push(b);
                break;
            case "tiberium":
                b = tiberium.add(a), game.items.push(b), this.tiberium.push(b);
                break;
            default:
                alert("Did not load " + a.type + " : " + a.name)
            }
            return b
        },
        setViewport: function () {
            game.context.beginPath(), this.viewportWidth = sidebar.visible ? this.screenWidth - sidebar.width : this.screenWidth, this.viewportHeight = 480, game.context.rect(this.viewportLeft, this.viewportTop, this.viewportWidth - this.viewportLeft, this.viewportHeight), game.context.clip()
        },
        drawMap: function () {
            mouse.handlePanning(), game.context.drawImage(maps.currentMapImage, this.viewportX, this.viewportY, this.viewportWidth, this.viewportHeight, this.viewportLeft, this.viewportTop, this.viewportWidth, this.viewportHeight)
        },
        count: function (a, b, c) {
            if (!b) return game[a].length;
            if (!c) {
                var d = 0;
                for (var e = 0; e < game[a].length; e++) game[a][e].player == b && d++;
                return d
            }
            var d = 0;
            for (var e = 0; e < game[a].length; e++) game[a][e].player == b && game[a][e].uid == c && d++;
            return d
        },
        buildingLandscapeChanged: !0,
        createGrids: function () {
            if (!game.terrainGrid) {
                game.buildingLandscapeChanged = !0;
                var a = Array(maps.currentMapTerrain.length);
                for (var b = 0; b < maps.currentMapTerrain.length; b++) {
                    a[b] = Array(maps.currentMapTerrain[b].length);
                    for (var c = 0; c < maps.currentMapTerrain[b].length; c++) maps.currentMapTerrain[b][c] ? a[b][c] = 1 : a[b][c] = 0
                }
                for (var b = game.trees.length - 1; b >= 0; b--) {
                    var d = game.trees[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridShape[c][e] == 1 && (a[Math.floor(d.y) + c][Math.floor(d.x) + e] = 1)
                }
                game.terrainGrid = a, game.foggedBuildableGrid = $.extend(!0, [], game.terrainGrid)
            }
            if (game.buildingLandscapeChanged) {
                game.buildingLandscapeChanged = !1, game.obstructionGrid = $.extend(!0, [], game.terrainGrid);
                for (var b = game.buildings.length - 1; b >= 0; b--) {
                    var d = game.buildings[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridShape[c][e] == 1 && (game.obstructionGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
                for (var b = game.turrets.length - 1; b >= 0; b--) {
                    var d = game.turrets[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridShape[c][e] == 1 && (game.obstructionGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
                for (var b = game.walls.length - 1; b >= 0; b--) {
                    var d = game.walls[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridShape[c][e] == 1 && (game.obstructionGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
            }
            game.foggedObstructionGrid || (game.foggedObstructionGrid = {});
            for (var f = game.players.length - 1; f >= 0; f--) {
                var g = game.players[f],
                    h = fog.fogGrid[g];
                game.foggedObstructionGrid[g] || (game.foggedObstructionGrid[g] = $.extend(!0, [], game.obstructionGrid));
                for (var c = game.foggedObstructionGrid[g].length - 1; c >= 0; c--) for (var e = game.foggedObstructionGrid[g][c].length - 1; e >= 0; e--) game.foggedObstructionGrid[g][c][e] = h[c][e] == 1 ? 0 : game.obstructionGrid[c][e]
            }
            if (sidebar.deployMode) {
                var h = fog.fogGrid[game.player];
                for (var c = game.foggedBuildableGrid.length - 1; c >= 0; c--) for (var e = game.foggedBuildableGrid[c].length - 1; e >= 0; e--) game.foggedBuildableGrid[c][e] = h[c][e] == 1 ? 1 : game.terrainGrid[c][e];
                for (var b = game.buildings.length - 1; b >= 0; b--) {
                    var d = game.buildings[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridBuild[c][e] == 1 && (game.foggedBuildableGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
                for (var b = game.turrets.length - 1; b >= 0; b--) {
                    var d = game.turrets[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridBuild[c][e] == 1 && (game.foggedBuildableGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
                for (var b = game.walls.length - 1; b >= 0; b--) {
                    var d = game.walls[b];
                    for (var c = d.gridShape.length - 1; c >= 0; c--) for (var e = d.gridShape[c].length - 1; e >= 0; e--) d.gridBuild[c][e] == 1 && (game.foggedBuildableGrid[Math.floor(d.y) + c][Math.floor(d.x) + e] = d.name)
                }
                for (var b = game.vehicles.length - 1; b >= 0; b--) {
                    var d = game.vehicles[b];
                    game.foggedBuildableGrid[Math.floor(d.y)][Math.floor(d.x)] = d.name
                }
                for (var b = game.infantry.length - 1; b >= 0; b--) {
                    var d = game.infantry[b];
                    game.foggedBuildableGrid[Math.floor(d.y)][Math.floor(d.x)] = d.name
                }
            }
        },
        animationLoop: function () {
            mouse.setCursor(), sidebar.animate(), game.createGrids();
            for (var a = game.items.length - 1; a >= 0; a--) game.items[a].processOrders(), game.items[a].animate();
            for (var a = game.effects.length - 1; a >= 0; a--) game.effects[a].animate();
            for (var a = game.bullets.length - 1; a >= 0; a--) game.bullets[a].animate();
            fog.animate(), game.sortedItemsArray ? game.sortedItemsArray.length = 0 : game.sortedItemsArray = [];
            for (var a = game.items.length - 1; a >= 0; a--) game.sortedItemsArray.push(game.items[a]);
            game.sortedItemsArray.sort(function (a, b) {
                var c = b.cgY ? b.cgY : b.y,
                    d = a.cgY ? a.cgY : a.y;
                return c - d + (c == d ? a.x - b.x : 0)
            }), game.lastAnimationTime = (new Date).getTime()
        },
        drawingLoop: function () {
            mouse.draw(), game.context.save(), sidebar.draw(), game.setViewport(), game.drawMap();
            for (var a = game.tiberium.length - 1; a >= 0; a--) game.tiberium[a].draw();
            for (var a = game.ships.length - 1; a >= 0; a--) game.ships[a].draw();
            for (var a = game.sortedItemsArray.length - 1; a >= 0; a--) game.sortedItemsArray[a].type != "ships" && game.sortedItemsArray[a].type != "tiberium" && game.sortedItemsArray[a].draw();
            for (var a = game.effects.length - 1; a >= 0; a--) game.effects[a].draw();
            for (var a = game.bullets.length - 1; a >= 0; a--) game.bullets[a].draw();
            if (game.debugMode) {
                game.context.strokeStyle = "rgba(0,0,0,0.7)", game.context.font = "9px Arial";
                for (var a = 0; a < maps.currentMapData.height; a++) game.context.strokeRect(game.viewportLeft + 0 - game.viewportX, a * game.gridSize + game.viewportTop - game.viewportY, maps.currentMapImage.width, game.gridSize);
                for (var b = 0; b < maps.currentMapData.width; b++) game.context.strokeRect(game.viewportLeft + b * game.gridSize - game.viewportX, 0 + game.viewportTop - game.viewportY, game.gridSize, maps.currentMapImage.height);
                for (var a = maps.currentMapData.height - 1; a >= 0; a--) for (var b = maps.currentMapData.width - 1; b >= 0; b--) {
                    var c = maps.currentMapTerrain[a][b] || "";
                    game.context.fillStyle = c == "tree" ? "rgba(0,255,0,0.6)" : c == "water" ? "rgba(0,0,255,0.6)" : c == "rocks" ? "rgba(255,0,0,0.6)" : "rgba(255,255,255,0.6)", game.context.strokeText(b + " " + a, game.viewportLeft + b * game.gridSize + 5 - game.viewportX, a * game.gridSize + 15 + game.viewportTop - game.viewportY), game.obstructionGrid && game.obstructionGrid[a] && game.terrainGrid[a][b] && game.context.fillRect(game.viewportLeft + b * game.gridSize - game.viewportX, a * game.gridSize + game.viewportTop - game.viewportY, game.gridSize, game.gridSize)
                }
            }
            game.debugMode || fog.draw();
            if (sidebar.deployMode) {
                var d = sidebar.deployBuilding,
                    e = $.extend([], d.gridBuild);
                sidebar.canBuildHere = !0;
                for (var f = 0; f < e.length; f++) for (var g = 0; g < e[f].length; g++) e[f][g] == 1 && (mouse.gridY + f < 0 || mouse.gridY + f >= game.foggedBuildableGrid.length || mouse.gridX + g < 0 || mouse.gridX + g >= game.foggedBuildableGrid[mouse.gridY + f].length || game.foggedBuildableGrid[mouse.gridY + f][mouse.gridX + g] != 0 ? (game.highlightGrid(mouse.gridX + g, mouse.gridY + f, 1, 1, sidebar.placementRedImage), sidebar.canBuildHere = !1) : game.highlightGrid(mouse.gridX + g, mouse.gridY + f, 1, 1, sidebar.placementWhiteImage))
            }
            if (game.showEnding) {
                var h = game.showEnding == "success" ? sidebar.missionAccomplished : sidebar.missionFailed;
                game.context.drawImage(h, game.viewportLeft + game.viewportWidth / 2 - h.width / 2, game.viewportTop + game.viewportHeight / 2 - h.height / 2)
            }
            if (game.showMessage) {
                game.context.fillStyle = "black";
                var i = 260,
                    j = 80;
                game.context.fillRect(game.viewportLeft + game.viewportWidth / 2 - i / 2, game.viewportTop + game.viewportHeight / 2 - j / 2, i, j), game.context.strokeStyle = "green", game.context.strokeRect(game.viewportLeft + game.viewportWidth / 2 - i / 2 + 10, game.viewportTop + game.viewportHeight / 2 - j / 2 + 10, i - 20, j - 20), game.context.strokeText(game.showMessage, game.viewportLeft + game.viewportWidth / 2 - i / 2 + 30, game.viewportTop + game.viewportHeight / 2)
            }
            game.context.restore(), game.type == "multi-player" && (game.context.fillStyle = "white", game.context.fillText(multiplayer.currentTick, 10, 10), game.context.fillStyle = "gray", game.context.fillText(multiplayer.lastTickReceived, 50, 10), multiplayer.gameLagging && (game.context.fillStyle = "rgb(50,50,50)", game.context.fillText("Server sync...", 100, 10)))
        },
        highlightGrid: function (a, b, c, d, e) {
            var f = game.gridSize;
            e && $(e).is("img") ? game.context.drawImage(e, a * f + game.viewportAdjustX, b * f + game.viewportAdjustY, c * f, d * f) : (e ? game.context.fillStyle = e : game.context.fillStyle = "rgba(225,225,225,0.5)", game.context.fillRect(a * f + game.viewportAdjustX, b * f + game.viewportAdjustY, c * f, d * f))
        },
        animationTimeout: 100,
        speedAdjustmentFactor: 6,
        animationInterval: undefined,
        drawingTimeout: 100,
        drawingInterval: undefined,
        start: function (a) {
            if (game.triggers) for (var b = 0; b < game.triggers.length; b++) game.triggers[b].init();
            game.terrainGrid = undefined, game.foggedObstructionGrid = undefined, game.obstructionGrid = undefined, sidebar.init(), game.running = !0, game.showEnding = undefined, fog.init(), game.animationLoop(), game.type == "singleplayer" ? game.animationInterval = setInterval(game.animationLoop, game.animationTimeout) : game.animationInterval = undefined, game.drawingUsingAnimFrame(), game.backgroundMusicStart(), a && a()
        },
        lastDrawTime: undefined,
        fps: 0,
        frames: 0,
        drawingUsingAnimFrame: function (a) {
            game.running && requestAnimationFrame(game.drawingUsingAnimFrame), game.lastDrawTime = (new Date).getTime(), game.lastAnimationTime && (game.movementInterpolationFactor = (game.lastDrawTime - game.lastAnimationTime) / game.animationTimeout - 1, game.movementInterpolationFactor > 0 && (game.movementInterpolationFactor = 0)), game.drawingLoop()
        },
        stop: function () {
            game.running = !1, game.clearSelection(), mouse.cursor = mouse.cursors["default"], game.animationInterval && clearInterval(game.animationInterval), game.animationInterval = undefined, game.backgroundMusic && (game.backgroundMusic.pause(), game.backgroundMusic.currentTime = 0, $(game.backgroundMusic).unbind("ended"), game.backgroundMusic = undefined)
        },
        backgroundMusic: undefined,
        backgroundMusicStart: function () {
            game.running ? (game.backgroundMusic = sounds.play("music"), $(game.backgroundMusic).bind("ended", function () {
                $(game.backgroundMusic).unbind("ended"), game.backgroundMusicStart()
            })) : game.backgroundMusic && (game.backgroundMusic.pause(), game.backgroundMusic.currentTime = 0, $(game.backgroundMusic).unbind("ended"), game.backgroundMusic = undefined)
        },
        load: function () {
            this.canvas = $("#gamecanvas")[0], this.context = this.canvas.getContext("2d"), this.screenWidth = this.canvas.width, this.screenHeight = this.canvas.height, menus.load(), mouse.load(), sidebar.load(), sounds.loadAll(), effects.loadAll(), bullets.loadAll()
        },
        controlGroups: [],
        keyPressed: function (a) {
            if (!game.running) return;
            var b = a.which,
                c = a.ctrlKey;
            if (b < 48 || b > 57) {
                if (b != 103) {
                    console.log("key pressed", b);
                    return
                }
                for (var e = game.selectedAttackers.length - 1; e >= 0; e--) game.sendCommand(game.selectedAttackers[e], {
                    type: "guard"
                })
            } else {
                var d = b - 48;
                if (c) game.selectedItems.length > 0 && (game.controlGroups[d] = $.extend([], game.selectedItems));
                else if (game.controlGroups[d]) {
                    game.clearSelection();
                    for (var e = game.controlGroups[d].length - 1; e >= 0; e--) game.controlGroups[d][e].lifeCode == "dead" ? game.controlGroups[d].splice(e, 1) : game.selectItem(game.controlGroups[d][e])
                }
            }
            return a.preventDefault(), a.stopPropagation(), !1
        },
        init: function () {
            if (!game.loaded) {
                setTimeout(game.init, 100);
                return
            }
            console.log("Images Loaded. Starting game"), menus.show("game-type"), mouse.show()
        }
    },
    triggers = {
        init: function () {
            while (game.triggers && game.triggers.length > 0) {
                var a = game.triggers.pop();
                a.triggerTimeout ? clearTimeout(a.triggerTimeout) : a.triggerInterval && clearInterval(a.triggerInterval)
            }
        },
        add: function (item) {
            switch (item.action) {
            case "add":
                item.triggerFunction = function () {
                    item.reinforcements && sounds.play("reinforcements_have_arrived");
                    for (var a = item.items.length - 1; a >= 0; a--) game.add(item.items[a])
                };
                break;
            case "hunt":
                item.triggerFunction = function () {
                    for (var a = game.items.length - 1; a >= 0; a--) {
                        var b = game.items[a];
                        b.player == item.player && (b.type == "infantry" || b.type == "vehicles") && (b.orders = {
                            type: "hunt"
                        })
                    }
                };
                break;
            case "function":
                item.triggerFunction = function () {
                    eval(item.
                    function)
                };
                break;
            case "success":
                item.triggerFunction = function () {
                    singlePlayer.endLevel(!0)
                };
                break;
            case "failure":
                item.triggerFunction = function () {
                    singlePlayer.endLevel(!1)
                }
            }
            switch (item.name) {
            case "timed":
                item.init = function () {
                    item.triggerTimeout = setTimeout(item.triggerFunction, item.time * 80 * game.animationTimeout)
                };
                break;
            case "enter":
                item.init = function () {
                    item.triggerInterval = setInterval(function () {
                        var a = !1;
                        for (var b = game.items.length - 1; b >= 0; b--) {
                            var c = game.items[b];
                            if (c.player == item.player && c.x >= item.region.x1 && c.x <= item.region.x2 && c.y >= item.region.y1 && c.y <= item.region.y2) {
                                a = !0;
                                break
                            }
                        }
                        a && (item.triggerFunction(), clearInterval(item.triggerInterval), item.triggerInterval = undefined)
                    }, game.animationTimeout * 20)
                };
                break;
            case "condition":
                item.init = function () {
                    item.triggerInterval = setInterval(function () {
                        eval(item.condition) && (item.triggerFunction(), clearInterval(item.triggerInterval), item.triggerInterval = undefined)
                    }, game.animationTimeout * 20)
                }
            }
            return item
        }
    },
    singlePlayer = {
        currentLevel: 0,
        currentFaction: undefined,
        sendCommand: function (a) {
            game.receiveCommand(a.uid, a.orders)
        },
        startCampaign: function (a) {
            singlePlayer.currentLevel = 0, singlePlayer.currentFaction = a, game.type = "singleplayer", singlePlayer.startLevel()
        },
        startLevel: function () {
            var a = maps[singlePlayer.currentFaction];
            triggers.init();
            if (a.length > singlePlayer.currentLevel) {
                var b = "single-player/" + singlePlayer.currentFaction + "/" + a[singlePlayer.currentLevel];
                game.players = ["GoodGuy", "BadGuy"], maps.load(b)
            } else menus.showMessageBox('This was the last mission in this campaign. I am currently working on patching bugs and adding more missions. <br><br>Watch this page, or follow my twitter feed (<a href="//twitter.com/adityarshankar" target="_blank">@adityarshankar</a>) for updates.<br><br>For now, please try the other campaign.', "Last Mission", function () {
                menus.show("game-type")
            })
        },
        endLevel: function (a) {
            a ? (sounds.play("mission_accomplished"), game.showEnding = "success", singlePlayer.currentLevel++, setTimeout(function () {
                singlePlayer.startLevel()
            }, 5e3)) : (sounds.play("mission_failure"), game.showEnding = "failure", setTimeout(function () {
                menus.show("game-type")
            }, 5e3)), game.stop()
        }
    },
    multiplayer = {
        currentLevel: 0,
        messageTimeout: 3e3,
        currentTick: undefined,
        commands: [],
        rejectPlayer: function (a) {
            if (!a) {
                menus.showMessageBox("You must select a player to reject.", "");
                return
            }
            if (a == this.userDetails.clientId) {
                menus.showMessageBox("You can't reject yourself! You might develop serious self-esteem problems.", "");
                return
            }
            menus.showMessageBox("Rejecting player not yet implemented...", "")
        },
        startNewGame: function (a) {
            a.gameId = this.userDetails.currentlySelectedGame, now.startNewGame(a, function () {}, function (a) {
                menus.showMessageBox(a, "Could not start game")
            })
        },
        showPopupMessage: function (a, b) {
            multiplayer.popupMessage = a, setTimeout(function () {
                game.popupMessage = undefined, b && b()
            }, multiplayer.messageTimeout)
        },
        endMultiplayerGame: function () {
            game.stop(), game.context.clearRect(0, 0, game.canvas.width, game.canvas.height), menus.show("game-type")
        },
        loadMultiplayerGame: function (a) {
            game.player = multiplayer.userDetails.userName, menus.hide(), game.type = "multi-player", multiplayer.gameObject = a, triggers.init();
            var b = game.type + "/" + a.map;
            now.showPopupMessage = function (a) {
                multiplayer.showPopupMessage(a)
            }, now.gameDisconnected = function (a) {
                multiplayer.showPopupMessage(a, function () {
                    multiplayer.endMultiplayerGame()
                })
            }, now.playersReady = function (a) {
                multiplayer.currentTick = 0, multiplayer.commands = [], a(), game.showMessage = undefined, game.animationInterval = setInterval(function () {
                    multiplayer.popupMessage && (game.showMessage = multiplayer.popupMessage);
                    if (multiplayer.lastTickReceived > multiplayer.currentTick) {
                        multiplayer.gameLagging = !1, multiplayer.lagTicks = 0;
                        if (now.syncError) {
                            game.showMessage = "Games are out of sync :(  ...";
                            return
                        }
                        multiplayer.currentTick++;
                        if (multiplayer.commands[multiplayer.currentTick]) for (var a = multiplayer.commands[multiplayer.currentTick].length - 1; a >= 0; a--) commandObject = multiplayer.commands[multiplayer.currentTick][a], game.receiveCommand(commandObject.uid, commandObject.orders);
                        game.animationLoop();
                        if (now.sendCommand) {
                            var b = {
                                items: [],
                                itemCount: game.items.length,
                                buildingCount: game.buildings.length,
                                infantryCount: game.infantry.length,
                                vehiclesCount: game.vehicles.length
                            };
                            for (var a = 0; a < game.items.length; a++) {
                                var c = game.items[a];
                                b.items.push({
                                    uid: c.uid,
                                    name: c.name,
                                    x: c.x,
                                    y: c.y,
                                    health: c.life,
                                    lastMovementX: c.lastMovementX,
                                    lastMovementY: c.lastMovementY,
                                    direction: c.direction,
                                    path: c.path,
                                    start: c.start,
                                    end: c.end
                                })
                            }
                            now.sendCommand(!1, multiplayer.currentTick, multiplayer.lastTickReceived, b)
                        }
                    } else multiplayer.gameLagging = !0, multiplayer.lagTicks++, multiplayer.lagTicks > 50 ? game.showMessage = "Other players are slowing down the game..." : game.showMessage = multiplayer.popupMessage
                }, game.animationTimeout)
            }, now.receiveTick = function (a, b) {
                multiplayer.commands[a] = b, multiplayer.lastTickReceived = a, b.length && console.log("Received list of commands from", a, "i am at", multiplayer.currentTick)
            }, maps.load(b, function () {
                now.confirmReadyToBegin(), game.showMessage = "Waiting for other players ..."
            })
        },
        sendCommand: function (a) {
            console.log("sent command at", new Date, multiplayer.currentTick), now.sendCommand(a, multiplayer.currentTick, multiplayer.lastTickReceived)
        },
        gameList: [],
        userDetails: {},
        loadUserDetails: function () {
            var a = $.trim($("#player-name").val());
            return a ? (now && now.core && now.core.clientId && (multiplayer.userDetails.clientId = now.core.clientId), multiplayer.userDetails.userName = a, multiplayer.userDetails.color = $("input:radio[name=multiplayer-team-color]:checked").val(), multiplayer.userDetails.team = $("input:radio[name=multiplayer-team]:checked").val(), multiplayer.userDetails.currentlySelectedGame = $("#games option:selected").val(), !0) : (menus.showMessageBox("You need to enter your name before creating a new game or joining an existing game.", "Name not entered"), !1)
        },
        createNewGame: function () {
            now.createNewGame(multiplayer.userDetails, function (a) {
                menus.show("start-network-game"), multiplayer.userDetails.currentlySelectedGame = a.gameId, now.refreshPlayerList()
            }, function (a) {
                menus.showMessageBox(a, "Could not create game")
            })
        },
        cancelNewGame: function () {
            now.cancelNewGame(multiplayer.userDetails, function () {
                menus.show("join-network-game")
            }, function () {
                menus.showMessageBox("There was some network trouble in cancelling the game. Please try again.", "Could not cancel game")
            })
        },
        joinExistingGame: function () {
            now.joinGame(this.userDetails, this.userDetails.currentlySelectedGame, function (a) {
                multiplayer.userDetails.color = a.color, menus.show("joined-network-game")
            }, function (a) {
                menus.showMessageBox(a, "Could not join game")
            })
        },
        sendMessageToPlayers: function (a) {
            now.sendMessageToPlayers(this.userDetails, this.userDetails.currentlySelectedGame, a)
        },
        init: function () {
            typeof now != "undefined" && (now.startMultiplayerGame = multiplayer.loadMultiplayerGame, now.refreshGameList = function () {
                now.getGameList(function (a) {
                    var b = 0;
                    $("#games").empty();
                    for (var c in a) $("#games").append($("<option>").attr("value", c).attr("selected", c == multiplayer.userDetails.currentlySelectedGame).text(a[c].name));
                    now.refreshPlayerList()
                })
            }, now.refreshPlayerList = function () {
                var a = $('select[name="player-list"]');
                a.empty(), multiplayer.userDetails.currentlySelectedGame && now.getPlayerList(multiplayer.userDetails.currentlySelectedGame, function (b) {
                    for (var c = 0; c < b.length; c++) a.append($("<option style='color:" + b[c].color + "'>").attr("value", b[c].clientId).text(b[c].userName + " (" + b[c].team.toUpperCase() + ")"))
                })
            }, now.displayServerMessage = function (a) {
                var b = "<span style='color:white'>SYSTEM: " + a + "</span><br>";
                $("#sent-messages-server").html(b + $("#sent-messages-server").html()), $("#sent-messages-host").html(b + $("#sent-messages-host").html()), $("#sent-messages-player").html(b + $("#sent-messages-player").html())
            }, now.displayMessage = function (a, b, c) {
                var d = "<span style='color:" + c + "'>" + b + ": " + a + "</span><br>";
                $("#sent-messages-host").html(d + $("#sent-messages-host").html()), $("#sent-messages-player").html(d + $("#sent-messages-player").html())
            }, now.ready(function () {
                $("#games").change(function () {
                    multiplayer.userDetails.currentlySelectedGame = $("#games option:selected").val(), console.log(multiplayer.userDetails), now.refreshPlayerList()
                }), now.refreshGameList()
            }))
        }
    };
$(function () {
    game.load(), game.init()
})