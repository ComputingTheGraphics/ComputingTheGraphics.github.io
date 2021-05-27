---
title: This will be used as the title-tag of the page head
---

# BioCrowds

## Table of Contents:
* BioCrowds
* The Elements
* Two Scenarios
* Obstacles to the Scene

## BioCrowds

Biocrowds is a crowd simulation algorithm based on the formation of veination patterns on leaves. It prevents agents from colliding with each other on their way to their goal points using a notion of "personal space". <br/><br/> Personal space is modelled with a space colonization algorithm. Markers (just points) are scattered throughout the simulation space, on the ground. At each simulation frame, each marker becomes "owned" by the agent closest to it (with some max distance representing an agent's perception). <br/><br/> Agent velocity at the next frame is then computed using a sum of the displacement vectors to each of its markers. Because a marker can only be owned by one agent at a time, this technique prevents agents from colliding with one another.

## The Elements

Agents are set up as cylinders on the plane in the set up associated with whichever scene is currently toggled. The Markers are set up as point objects which can be toggled on and off with the check box associated with visual debugging.

## Two Scenarios

Created two base scenarios. Can flip between them by using the onScene bar. One is where the agents start out in a large circle and need to go to the location opposite them in the circle. The other is where the agents start out in a smaller circle and need to go to the destination opposite them in the larger circle.

## Obstacles to the scene

#### misc

a common simulation algorithm for moving agents around a scene. The technique was originally modeled after the vein pattern in leaves. This idea ultimately helps prevent agents from colliding with one another by using markers to keep a buffer range. Conventionally, this is modeled using the space colonization algorithm with markers scattered throughout the simulation space. During each timeStep, each markers is associated with the closest agent (within a max distance), and velocity for each agent is then calculated based on these markers.
