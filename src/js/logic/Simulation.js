import {
    createWorld,
    addEntity,
    addComponent,
    defineQuery,
  } from 'bitecs'

import { Food, Water, Position, PreviousPosition, Velocity, Motivation, Status } from './components';
import { decaySystem, motivationSystem, behaviorSystem, movementSystem, consumptionSystem } from './systems';

export default class Simulation {
    constructor(width, height) {
        this.world = createWorld();
        this.entities = [];
        
        this.width = width;
        this.height = height;

        this.initResources(this.world);
        this.initEntities(this.world);
    }

    initResources(world) {
        for (let i = 0; i < 2; i++) {
            const foodEntity = addEntity(world);
            addComponent(world, Food, foodEntity);
    
            Food.x[foodEntity] = Math.random() * this.width;
            Food.y[foodEntity] = Math.random() * this.height;
            Food.amount[foodEntity] = Math.random() * 100 + 50; // Random amount between 50 and 150

            this.entities.push(foodEntity);
    
            const waterEntity = addEntity(world);
            addComponent(world, Water, waterEntity);
    
            Water.x[waterEntity] = Math.random() * this.width;
            Water.y[waterEntity] = Math.random() * this.height;
            Water.amount[waterEntity] = Math.random() * 100 + 50; // Random amount between 50 and 150

            this.entities.push(waterEntity);
        }
    }

    initEntities(world) {
        for (let i = 0; i < 500; i++) {
            const entity = addEntity(world);
            addComponent(world, PreviousPosition, entity);
            addComponent(world, Position, entity);
            addComponent(world, Velocity, entity);
            addComponent(world, Motivation, entity);
            addComponent(world, Status, entity);

            Status.isAlive[entity] = true;

            // Initial values
            Position.x[entity] = Math.random() * this.width;
            Position.y[entity] = Math.random() * this.height;
            PreviousPosition.x[entity] = Position.x[entity];
            PreviousPosition.y[entity] = Position.y[entity];
            Velocity.dx[entity] = 0;
            Velocity.dy[entity] = 0;
            
            // Set motivation values
            Motivation.hunger[entity] = Math.random() * 50;
            Motivation.thirst[entity] = Math.random() * 50;
            Motivation.energy[entity] = Math.random() * 100;
            Motivation.curiosity[entity] = Math.random() * 100;

            this.entities.push(entity);
        }
    }

    getAgentState() {
        return this.entities.map(eid => {
            const x = Math.floor(Position.x[eid]);
            const y = Math.floor(Position.y[eid]);
            const prevX = Math.floor(PreviousPosition.x[eid]);
            const prevY = Math.floor(PreviousPosition.y[eid]);
            const isAlive = Status.isAlive[eid];

            const hunger = Motivation.hunger[eid];
            const thirst = Motivation.thirst[eid];
            
            // Determine direction based on previous and current position
            const dx = x - prevX;
            const dy = y - prevY;
            let direction = 'down'; // Default direction
        
            if (Math.abs(dx) > Math.abs(dy)) {
                direction = dx > 0 ? 'right' : 'left';
            } else {
                direction = dy > 0 ? 'up' : 'down';
            }
        
            // Check if the entity is near food or water for consuming state
            const isConsuming = false;
    
            return {
                x,
                y,
                direction,
                isConsuming,
                isAlive,
                hunger,
                thirst,
            };
        });
    }
    

    getResourcePositions() {
        const foodPositions = this.entities
            .filter(eid => Food.x[eid] !== undefined)
            .map(eid => ({
                type: 'food',
                x: Food.x[eid],
                y: Food.y[eid],
                amount: Food.amount[eid],
            }));
    
        const waterPositions = this.entities
            .filter(eid => Water.x[eid] !== undefined)
            .map(eid => ({
                type: 'water',
                x: Water.x[eid],
                y: Water.y[eid],
                amount: Water.amount[eid],
            }));
    
        return [...foodPositions, ...waterPositions];
    }

    updatePreviousPosition(world) {
        const entities = defineQuery([Position, PreviousPosition])(world);
        
        entities.forEach((eid) => {
            PreviousPosition.x[eid] = Position.x[eid];
            PreviousPosition.y[eid] = Position.y[eid];
        });
    }

    update() {
        // Run systems here, like movementSystem
        this.updatePreviousPosition(this.world); // Sync PreviousPosition with current Position

        decaySystem(this.world);        // Increase hunger and thirst over time
        motivationSystem(this.world);
        behaviorSystem(this.world);
        movementSystem(this.world);
        consumptionSystem(this.world);
    }
}