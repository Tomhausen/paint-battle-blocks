scene.onPathCompletion(SpriteKind.Enemy, function (sprite, location) {
    change_opponent_dir(sprite)
})
function fire (source: Sprite) {
    proj = sprites.create(image.create(4, 4), SpriteKind.Projectile)
    proj.image.fill(sprites.readDataNumber(source, "colour"))
    proj.setFlag(SpriteFlag.DestroyOnWall, true)
    proj.setPosition(source.x, source.y)
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
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    fire(red)
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
let greens = 0
let blues = 0
let reds = 0
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
let last_vx = 100
let last_vy = 0
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
