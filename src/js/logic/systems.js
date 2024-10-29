import { defineQuery, removeEntity } from 'bitecs';
import { Status, Food, Water, Position, Velocity, Motivation } from './components.js';

const HUNGER_DEATH_THRESHOLD = 120; // Adjust as needed
const THIRST_DEATH_THRESHOLD = 70; // Adjust as needed

// Define a query to get all entities with Position and Velocity
const foodQuery = defineQuery([Food]);
const waterQuery = defineQuery([Water]);
const movementQuery = defineQuery([Position, Velocity]);

function decaySystem(world) {
    const entities = defineQuery([Motivation])(world);

    entities.forEach((entity) => {
        Motivation.hunger[entity] += 0.5; // Hunger increases by 0.5 per update (adjust as needed)
        Motivation.thirst[entity] += 0.7; // Thirst increases by 0.7 per update

        // Cap at death thresholds if needed
        Motivation.hunger[entity] = Math.min(Motivation.hunger[entity], HUNGER_DEATH_THRESHOLD);
        Motivation.thirst[entity] = Math.min(Motivation.thirst[entity], THIRST_DEATH_THRESHOLD);
    });

    return world;
}

function findClosestResource(agentX, agentY, resourceEntities, ResourceComponent) {
    let closestEntity = null;
    let minDistance = Infinity;

    resourceEntities.forEach((eid) => {
        const dx = agentX - ResourceComponent.x[eid];
        const dy = agentY - ResourceComponent.y[eid];
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance && ResourceComponent.amount[eid] > 0) {
            minDistance = distance;
            closestEntity = eid;
        }
    });

    return closestEntity;
}

function motivationSystem(world) {
    const entities = defineQuery([Position, Velocity, Motivation, Status])(world);
    const foods = foodQuery(world);
    const waters = waterQuery(world);

    entities.forEach((entity) => {
        const agentX = Position.x[entity];
        const agentY = Position.y[entity];
        const hunger = Motivation.hunger[entity];
        const thirst = Motivation.thirst[entity];
        let isAlive = Status.isAlive[entity];

        if (hunger >= HUNGER_DEATH_THRESHOLD || thirst >= THIRST_DEATH_THRESHOLD) {
            isAlive = false; // Mark as dead
            removeEntity(world, entity);
            return; // Skip further processing for this entity
        }

        // Determine primary motivation (hunger vs thirst)
        const isHungry = hunger > 50;
        const isThirsty = thirst > 50;

        if (isHungry && (!isThirsty || Motivation.hunger[entity] >= Motivation.thirst[entity])) {
            // Hunger takes priority
            const closestFood = findClosestResource(agentX, agentY, foods, Food);
            if (closestFood !== null) {
                const dx = Food.x[closestFood] - agentX;
                const dy = Food.y[closestFood] - agentY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                Velocity.dx[entity] = (dx / distance) * 2;
                Velocity.dy[entity] = (dy / distance) * 2;
            }
        } else if (isThirsty) {
            // Thirst takes priority
            const closestWater = findClosestResource(agentX, agentY, waters, Water);
            if (closestWater !== null) {
                const dx = Water.x[closestWater] - agentX;
                const dy = Water.y[closestWater] - agentY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                Velocity.dx[entity] = (dx / distance) * 2;
                Velocity.dy[entity] = (dy / distance) * 2;
            }
        }
    });
    return world;
}


function behaviorSystem(world) {
    const entities = defineQuery([Position, Velocity, Motivation])(world);

    entities.forEach(entity => {
        const hungerLevel = Motivation.hunger[entity];
        const thirstLevel = Motivation.thirst[entity];
        const curiosityLevel = Motivation.curiosity[entity];

        if (hungerLevel > 80 || thirstLevel > 80) {
            // Prioritize high hunger or thirst for resource seeking
            motivationSystem(world); // Call motivationSystem to handle prioritized movement
        } else if (curiosityLevel > 50) {
            // Wander randomly if curiosity is high and hunger/thirst are not pressing
            Velocity.dx[entity] = (Math.random() - 0.5) * 2;
            Velocity.dy[entity] = (Math.random() - 0.5) * 2;
        } else {
            // Idle behavior or slowing down
            Velocity.dx[entity] *= 0.95; // Gradual slowdown over time
            Velocity.dy[entity] *= 0.95;
        }
    });

    return world;
}


function movementSystem(world) {
    const entities = movementQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const eid = entities[i];
        Position.x[eid] += Velocity.dx[eid];
        Position.y[eid] += Velocity.dy[eid];
    }
    return world;
}

function consumptionSystem(world) {
    const entities = defineQuery([Position, Motivation])(world);
    const foods = foodQuery(world);
    const waters = waterQuery(world);

    entities.forEach((entity) => {
        const agentX = Position.x[entity];
        const agentY = Position.y[entity];

        foods.forEach((foodEid) => {
            const dx = agentX - Food.x[foodEid];
            const dy = agentY - Food.y[foodEid];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5 && Food.amount[foodEid] > 0) {
                // Consume food
                Food.amount[foodEid] -= 1;
                Motivation.hunger[entity] = Math.max(0, Motivation.hunger[entity] - 10);
            }
        });

        waters.forEach((waterEid) => {
            const dx = agentX - Water.x[waterEid];
            const dy = agentY - Water.y[waterEid];
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5 && Water.amount[waterEid] > 0) {
                // Consume water
                Water.amount[waterEid] -= 1;
                Motivation.thirst[entity] = Math.max(0, Motivation.thirst[entity] - 10);
            }
        });
    });

    return world;
}



export { decaySystem, motivationSystem, behaviorSystem, movementSystem, consumptionSystem };