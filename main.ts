scene.onPathCompletion(SpriteKind.Enemy, function (sprite, location) {
    change_opponent_dir(sprite)
})
function fire (source: Sprite) {
    proj = sprites.create(image.create(4, 4), SpriteKind.Projectile)
    proj.image.fill(sprites.readDataNumber(source, "colour"))
    proj.setFlag(SpriteFlag.DestroyOnWall, true)
    proj.setPosition(source.x, source.y)
    proj.lifespan = 5000
    return proj
}
function target_tile_not_owned (opponent: Sprite) {
    start = opponent.tilemapLocation()
    targets = tilesAdvanced.getAllTilesWhereWallIs(false)
    tile_image = sprites.readDataImage(opponent, "tile")
    owned_tiles = tiles.getTilesByType(tile_image)
    for (let target of targets) {
        if (tilesAdvanced.tileIsInList(target, owned_tiles)) {
            targets.removeAt(targets.indexOf(target))
        }
    }
    sorted_targets = tilesAdvanced.sortListOfTilesByDistance(start, targets)
    path = scene.aStar(start, sorted_targets[0])
    scene.followPath(opponent, path, opponent_speed)
}
controller.combos.attachCombo("uu", function () {
    dash()
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fire(red).setVelocity(last_vx, last_vy)
})
controller.combos.attachCombo("dd", function () {
    dash()
})
function change_opponent_dir (opponent: Sprite) {
    if (opponent.vx != 0) {
        y_vel = randint(0, 1) * opponent_speed * 2 - opponent_speed
        opponent.setVelocity(0, y_vel)
    } else {
        x_vel = randint(0, 1) * opponent_speed * 2 - opponent_speed
        opponent.setVelocity(x_vel, 0)
    }
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Projectile, function (sprite, otherSprite) {
    if (otherSprite.image.getPixel(0, 0) != sprites.readDataNumber(sprite, "colour")) {
        sprite.sayText("!", 1000, false)
        for (let index = 0; index < 100; index++) {
            tiles.placeOnTile(sprite, sprite.tilemapLocation())
            pause(10)
        }
        sprites.destroy(otherSprite)
    }
})
controller.combos.attachCombo("rr", function () {
    dash()
})
function dash () {
    timer.throttle("dash", 2000, function () {
        dash_time = 250
        vx = red.vx
        vy = red.vy
        controller.moveSprite(red, 0, 0)
        red.startEffect(effects.ashes, dash_time)
        red.vx = vx * 2.5
        red.vy = vy * 2.5
        timer.after(dash_time, function () {
            controller.moveSprite(red)
            red.vx = 0
            red.vy = 0
        })
    })
}
info.onCountdownEnd(function () {
    reds = tiles.getTilesByType(assets.tile`red`).length
    blues = tiles.getTilesByType(assets.tile`blue`).length
    greens = tiles.getTilesByType(assets.tile`green`).length
    if (reds > blues && reds > greens) {
        game.over(true)
    } else {
        game.over(false)
    }
})
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Food, function (sprite, otherSprite) {
    tile_image = sprites.readDataImage(sprite, "tile")
    local_tiles = tilesAdvanced.getAdjacentTiles(Shapes.Square, sprite.tilemapLocation(), 2)
    for (let value of local_tiles) {
        if (!(tiles.tileAtLocationIsWall(value))) {
            tiles.setTileAt(value, tile_image)
        }
    }
    sprites.destroy(otherSprite)
})
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    change_opponent_dir(sprite)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Projectile, function (sprite, otherSprite) {
    if (otherSprite.image.getPixel(0, 0) != sprites.readDataNumber(sprite, "colour")) {
        sprite.sayText("!", 1000, false)
        for (let index = 0; index < 100; index++) {
            tiles.placeOnTile(sprite, sprite.tilemapLocation())
            pause(10)
        }
        sprites.destroy(otherSprite)
    }
})
controller.combos.attachCombo("ll", function () {
    dash()
})
function opponent_behaviour (opponent: Sprite) {
    tile_image = sprites.readDataImage(opponent, "tile")
    tiles.setTileAt(opponent.tilemapLocation(), tile_image)
    if (randint(1, 50) == 1) {
        change_opponent_dir(opponent)
    } else if (randint(1, 50) == 1) {
        target_tile_not_owned(opponent)
    }
    if (randint(1, 150) == 1) {
        proj = fire(opponent)
        proj.setVelocity(opponent.vx * 2, opponent.vy * 2)
    }
}
function setup_map () {
    tiles.setCurrentTilemap(tilemap`level`)
    scene.cameraFollowSprite(red)
    tiles.placeOnRandomTile(red, assets.tile`spawn`)
    tiles.setTileAt(red.tilemapLocation(), assets.tile`red`)
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        tiles.placeOnRandomTile(value, assets.tile`spawn`)
        tile_image = sprites.readDataImage(value, "tile")
        tiles.setTileAt(value.tilemapLocation(), tile_image)
        opponent_behaviour(value)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    tile_image = sprites.readDataImage(sprite, "tile")
    local_tiles = tilesAdvanced.getAdjacentTiles(Shapes.Square, sprite.tilemapLocation(), 2)
    for (let value of local_tiles) {
        if (!(tiles.tileAtLocationIsWall(value))) {
            tiles.setTileAt(value, tile_image)
        }
    }
    sprites.destroy(otherSprite)
})
let random_tile: tiles.Location = null
let star: Sprite = null
let local_tiles: tiles.Location[] = []
let greens = 0
let blues = 0
let reds = 0
let vy = 0
let vx = 0
let dash_time = 0
let x_vel = 0
let y_vel = 0
let path: tiles.Location[] = []
let sorted_targets: tiles.Location[] = []
let owned_tiles: tiles.Location[] = []
let tile_image: Image = null
let targets: tiles.Location[] = []
let start: tiles.Location = null
let proj: Sprite = null
let opponent_speed = 0
let last_vy = 0
let last_vx = 0
let red: Sprite = null
red = sprites.create(assets.image`red player`, SpriteKind.Player)
let blue = sprites.create(assets.image`blue player`, SpriteKind.Enemy)
let green = sprites.create(assets.image`green player`, SpriteKind.Enemy)
sprites.setDataImageValue(red, "tile", assets.tile`red`)
sprites.setDataImageValue(blue, "tile", assets.tile`blue`)
sprites.setDataImageValue(green, "tile", assets.tile`green`)
sprites.setDataNumber(red, "colour", 3)
sprites.setDataNumber(blue, "colour", 6)
sprites.setDataNumber(green, "colour", 9)
last_vx = 100
last_vy = 0
opponent_speed = 75
info.startCountdown(120)
controller.moveSprite(red)
setup_map()
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        opponent_behaviour(value)
    }
    tiles.setTileAt(red.tilemapLocation(), assets.tile`red`)
    if (red.vx != 0 || red.vy != 0) {
        last_vx = red.vx
        last_vy = red.vy
    }
})
game.onUpdateInterval(10000, function () {
    star = sprites.create(assets.image`star`, SpriteKind.Food)
    star.lifespan = 7500
    random_tile = tilesAdvanced.getAllTilesWhereWallIs(false)._pickRandom()
    tiles.placeOnTile(star, random_tile)
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        if (randint(1, 5) == 1) {
            path = scene.aStar(value.tilemapLocation(), star.tilemapLocation())
            scene.followPath(value, path, opponent_speed)
        }
    }
})
