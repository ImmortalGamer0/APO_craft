// Stabilizer
IDRegistry.genBlockID("stabilizer");
Block.createBlock("stabilizer", [
    {name: "Stabilizer", texture: [["stabilizer", 0], ["stabilizer", 0], ["stabilizer", 0], ["stabilizer", 0], ["stabilizer", 0], ["stabilizer", 0]], inCreative: true}
], BLOCK_HARD);


// Stabilizer casing


// Stabilizer Winding
IDRegistry.genBlockID("windingStabilizer");
Block.createBlock("windingStabilizer", [
    {name: "Stabilizer Winding", texture: [["block_lead", 0]], inCreative: true}
], BLOCK_HARD);

(function(){
    var width = 0.1;
    
    var group = ICRender.getGroup("stabilizer");
    group.add(BlockID.stabilizer, -1);
    
    var model = new ICRender.Model();
    model.addEntry(new BlockRenderer.Model(0.4, 0.4, 0.4, 0.6, 0.6, 0.6, BlockID.windingStabilizer, 0));
    
    var boxes = [
        {side: [-1, 0, 0], box: [0, 0, 0, width, width, 1]},
        {side: [-1, 0, 0], box: [0, 0, 0, width, 1, width]},
        {side: [-1, 0, 0], box: [0, 0, 1 - width, width, 1, 1]},
        {side: [-1, 0, 0], box: [0, 1 - width, 0, width, 1, 1]},
        
        {side: [1, 0, 0], box: [1 - width, 0, 0, 1, width, 1]},
        {side: [1, 0, 0], box: [1 - width, 0, 0, 1, 1, width]},
        {side: [1, 0, 0], box: [1 - width, 0, 1 - width, 1, 1, 1]},
        {side: [1, 0, 0], box: [1 - width, 1 - width, 0, 1, 1, 1]},
        
        {side: [0, -1, 0], box: [0, 0, 0, width, width, 1]},
        {side: [0, -1, 0], box: [0, 0, 0, 1, width, width]},
        {side: [0, -1, 0], box: [0, 0, 1 - width, 1, width, 1]},
        {side: [0, -1, 0], box: [1 - width, 0, 0, 1, width, 1]},
        
        {side: [0, 0, -1], box: [0, 0, 0, width, 1, width]},
        {side: [0, 0, -1], box: [0, 0, 0, 1, width, width]},
        {side: [0, 0, -1], box: [0, 1 - width, 0, 1, 1, width]},
        {side: [0, 0, -1], box: [1 - width, 0, 0, 1, 1, width]},
        
        {side: [0, 0, 1], box: [0, 0, 1 - width, width, 1, 1]},
        {side: [0, 0, 1], box: [0, 0, 1 - width, 1, width, 1]},
        {side: [0, 0, 1], box: [0, 1 - width, 1 - width, 1, 1, 1]},
        {side: [0, 0, 1], box: [1 - width, 0, 1 - width, 1, 1, 1]},
    ];
    
    for(var i in boxes){
        var box = boxes[i].box; 
        var side = boxes[i].side;

        model.addEntry(new BlockRenderer.Model(box[0], box[1], box[2], box[3], box[4], box[5], BlockID.windingStabilizer, 0))
            .setCondition(new ICRender.BLOCK(side[0], side[1], side[2], group, false));
    }
    
    BlockRenderer.setStaticICRender(BlockID.windingStabilizer, -1, model);
})();
 


var layoutStabilizer = {
    standart: {
        header: {text: {text: "Stabilizer"}},
        inventory: {standart: true},
        background: {standart: true}
    },
    
    drawing: [
        {type: "bitmap", x: 860, y: 220, bitmap: "energy_small_background", scale: GUI_BAR_STANDART_SCALE}
    ],
    
    elements: {
        "energyScale": {type: "scale", x: 860, y: 220, direction: 1, value: 0, bitmap: "energy_small_scale", scale: GUI_BAR_STANDART_SCALE},
        "slot0": {type: "slot", x: 570, y: 215}
    }
}

var slotsStabilizer = [];
for(var i = 0; i < 6; i++){
    let angle = i * 60 * Math.PI / 180;
    dx = 150 * Math.cos(angle);
    dy = 150 * Math.sin(angle);
    layoutStabilizer.elements["slot" + (i + 1)] = {type: "slot", x: 570 + dx, y: 215 + dy};
    slotsStabilizer.push("slot" + (i + 1));
}


var guiRectifier = new UI.StandartWindow(layoutStabilizer);


TileEntity.registerPrototype(BlockID.stabilizer, {
    components: [ItemID.cpu, ItemID.motherboard, ItemID.ram, ItemID.powerSupply, ItemID.cardVideo, ItemID.hdd, ItemID.systemCooling],
    
    defaultValues: {
        progress: 0,
    },
    
    checkStructure: function(){
        let x = this.x;
        let y = this.y;
        let z = this.z;
        return World.getBlock(x, y - 1, z).id == BlockID.bigRadiator
            && World.getBlock(x - 1, y, z).id == BlockID.windingStabilizer
            && World.getBlock(x + 1, y, z).id == BlockID.windingStabilizer
            && World.getBlock(x, y + 1, z).id == BlockID.windingStabilizer
            && World.getBlock(x, y, z - 1).id == BlockID.windingStabilizer
            && World.getBlock(x, y, z + 1).id == BlockID.windingStabilizer;
    },
    
    checkSlots: function(){
        for(var i = 0; i < this.components.length; i++){
            let slot = this.container.getSlot("slot" + i);
            if(slot.count != 1 || slot.id != this.components[i]){
                return false;
            }
        }
        return true;
    },
    
    buildPortal: function(){
        // Fill everything but radiator
        for(var x = this.x - 2; x <= this.x + 2; x++){
            for(var z = this.z - 2; z <= this.z + 2; z++){
                if(z == this.z && x == this.x){
                    continue;
                }
                World.setBlock(x, this.y - 1, z, BlockID.aetherPortal, 0);
            }
        }
        // Bedrock in the corners
        World.setBlock(this.x - 2, this.y - 1, this.z - 2, 7, 0);
        World.setBlock(this.x + 2, this.y - 1, this.z - 2, 7, 0);
        World.setBlock(this.x - 2, this.y - 1, this.z + 2, 7, 0);
        World.setBlock(this.x + 2, this.y - 1, this.z + 2, 7, 0);
    },
    
    tick: function(){
        if(this.data.progress > 1000 || !this.checkStructure() || !this.checkSlots()){
            return;
        }
        
        this.data.progress += 1;
        this.container.setScale("energyScale", this.data.progress / 1000);
        
        // Spawn Lightnings
        if(this.data.progress % 100 == 0){
            Game.message("light!");
            for(var i = 0; i < this.data.progress / 100; i++){
                Entity.spawn(this.x + Math.random() - 0.5, this.y + 1, this.z + Math.random() - 0.5, Native.EntityType.LIGHTNING_BOLT);
            }
        }
        
        // Build Portal
        if(this.data.progress == 1000){
            this.buildPortal();
        }
    },
    
    getGuiScreen: function(){
        return guiRectifier;
    }
});




