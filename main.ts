scene.onPathCompletion(SpriteKind.Enemy, function (sprite, location) {
    change_opponent_dir(sprite)
})
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
function change_opponent_dir (opponent: Sprite) {
    if (opponent.vx != 0) {
        y_vel = randint(0, 1) * opponent_speed * 2 - opponent_speed
        opponent.setVelocity(0, y_vel)
    } else {
        x_vel = randint(0, 1) * opponent_speed * 2 - opponent_speed
        opponent.setVelocity(x_vel, 0)
    }
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
scene.onHitWall(SpriteKind.Enemy, function (sprite, location) {
    change_opponent_dir(sprite)
})
function opponent_behaviour (opponent: Sprite) {
    tile_image = sprites.readDataImage(opponent, "tile")
    tiles.setTileAt(opponent.tilemapLocation(), tile_image)
    if (randint(1, 50) == 1) {
        change_opponent_dir(opponent)
    } else if (randint(1, 50) == 1) {
        target_tile_not_owned(opponent)
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
let opponent_speed = 0
let red: Sprite = null
red = sprites.create(assets.image`red player`, SpriteKind.Player)
let blue = sprites.create(assets.image`blue player`, SpriteKind.Enemy)
let green = sprites.create(assets.image`green player`, SpriteKind.Enemy)
sprites.setDataImageValue(red, "tile", assets.tile`red`)
sprites.setDataImageValue(blue, "tile", assets.tile`blue`)
sprites.setDataImageValue(green, "tile", assets.tile`green`)
opponent_speed = 75
info.startCountdown(120)
controller.moveSprite(red)
setup_map()
change_opponent_dir(blue)
game.onUpdate(function () {
    for (let value of sprites.allOfKind(SpriteKind.Enemy)) {
        opponent_behaviour(value)
    }
    tiles.setTileAt(red.tilemapLocation(), assets.tile`red`)
})
