---
title: This will be used as the title-tag of the page head
---

# Boids

## Table of Contents:
* Emergent Behavior
* Boid Rules
* Grid System
    * Scattered
    * Coherent
    * Additional Optimizations
* Resources

## Emergent Behaviors
TODO - ADD COMIC HERE!!!!!! <br/>
These programs of artificial life are focused on emergent behavior. Just like real-world organic systems, the resultant behavior is understood as an amalgamation of its parts and their relationships with one another. Some examples from nature include - fire ants creating a bridge, it is not one individual ant in charge telling them to to do so, but instead they begin building as a collective - birds in flight or schools of fish, they move in relation to one another with a general focus for a destination. In sum, it is a focus on systems or the combined small decisions by subsets of the larger group to create a final outcome, instead of clearly defined step-by-step procedures.
[Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_Life#/media/File:Gospers_glider_gun.gif)!


		One of the most understood examples in computer graphics is Conway's Game of Life. The game is configured as follows: there are <code>live</code> cells and <code>dead</code> cells all touching in a gridded formation. The user defines an initial state after which they do not interact with the program at all. Every following state organically develops through a set of predefined simple rules:<br/>

```
- a `live cell` with 2/3 `live neighbors` survives to the next round
- a `dead cell` with 3 `live neighbors` lives in the next round
- all other cells die in the next round
```

These simple rules lead to small behaviors named `still lives`, `oscillators`, and `spaceships`. Minimal versions of them can be seen below...

[Block Still Life | [Block Still Life](https://en.wikipedia.org/wiki/Conway's_Game_Of_Life#/media/File:Game_of_life_block_with_border.svg)! ]
[ Blinker Oscillator | [Blinker Oscillator](https://en.wikipedia.org/wiki/Conway's_Game_of_life#/media/File:Game_of_life_blinker.gif)! ]
[ Spaceship Glider | [Spaceship Glider](https://en.wikipedia.org/wiki/Conway's_Game_of_Life#/media/File:Game_of_life_animated_glider.gif)!]

which can be used to make larger behaviors occur such as ...



Instead of pixel changes like in Conway's Game of Life, this boid implementation developed by Craig Reynolds in 1986 is meant to define boid movements and in doing so simulate the flocking movement and orientation of birds in flight.


While Conway's Emergent behavior ----


swarm intelligence


## Rules


Since the execution is defined based on the initial state, the current implementation has a scattered initial distribution of the boid positions (each boid is a particle in the visual). There is also a positional wrapping, so that as the boids continue moving throughout the grid, they are maintained in the same cube of space, making the simulation more interesting.



In regards to the actual rules defined for the simulation - we have the following three ideas:

```
- `adhesion` - a force aiming to push ever boid to the center of mass of all boids near it
- `avoidance/dodging` - a force aiming to push every boid away from every other boid near it
- `cohesion` - a force aiming to make each boid have a similar velocity to those near it
```

The pseudocode is as follows:

```
<pre><code>main rule setup(Boid boid)
</code></pre>
	<div class="row">
		<div class="col-4 col-12-medium">
<pre><code>rule1_adhesion(Boid boid)
    vector perceived_center = 0
    float neighbor_count = 0

    foreach Boid b:
        if b != boid and distance(b, boid) < rule1Distance then
            perceived_center += b.position
            ++neighbor_count
        endif
    end
    perceived_center /= neighbor_count

    return (perceived_center - boid.position) * rule1Scale
</code></pre>
		</div>
		<div class="col-4 col-12-medium">
<pre><code>rule2_avoidance_dodging(Boid boid)
	vector avoidance_velocity = 0

	foreach Boid b
	    if b != boid and distance(b, boid) < rule2Distance then
	        avoidance_velocity += (boid.position - b.position)
	    endif
	end

	return avoidance_velocity * rule2Scale
</code></pre>
		</div>
		<div class="col-4 col-12-medium">
<pre><code>rule3_cohesion(Boid boid)
	vector cohesive_velocity = 0
	float neighbor_count = 0

	foreach Boid b
	    if b != boid and distance(b, boid) < rule3Distance then
	        cohesive_velocity += b.velocity
	        ++neighbor_count
	    endif
	end
	cohesive_velocity /= neighbor_count

	return cohesive_velocity * rule3Scale
</code></pre>
```


Since these only affect the delta by which a current velocity should be updated, the updated velocity for a current value is as follows:

`updated_vel = current_vel + rule1_adhesion + rule2_avoidance_dodging + rule3_cohesion`

For more reference regarding the pseudocode, see this derivation...

#### Grid System
For each boid, each rule is enacted on the boid itself and those within a specific distance near the boid to create the grouping effect we see in the final output. The way we actually find which boids are within those distances depends on how we're searching through our grid system.

#### Naive
For the first implementation, we iterate over every grid cell checking if any boid inside of the grid cell is within any of the specified distances for each of the three defined rules. This is costly for runtime as we're iterating over the entire grid width in all three dimensions.

#### Scattered
For the second implementation, we optimize our search based on a max distance instead of iterating over every grid cell possible. We set this distance as the max value of all three of the rule's comparison distances: `max_distance = max(rule1_distance, max(rule2_distance, rule3_distance))` 


#### checking based on cell locations
Then for each boid, we limit our search area based on the grid cells that have any aspect of them within the max_distance. This allows us to avoid having to do a positional comparison with the corner points of each grid cell, while at the same time also allowing a more flexible approach since we're just defining a min cell index and max cell index in all three cardinal directions. That is, we dont have to manually check a hard-coded specific number of surrounding cells depending on the implementation (such as the 8 surrounding cells, 27 surrounding cells, etc).

#### large versus small max distance
Also because we want to allow this grid to be placed anywhere in space, for other implementation purposes and project extensions, every time we do a position comparison to find a grid index, we must make sure the grid is zeroed. That is, we must make sure that the origin of our grid, which is not guaranteed to be (0, 0, 0), is actually (0, 0, 0) for our calculations. Thus, when doing update calculations, we must offset each position value by the grid origin's location: position_for_calculation = (position - gridOrigin).
        
#### zeroing the origin
##### Coherent
For the third implementation, we used the same algorithmic idea as in the scattered implementation; however, we speed up the runtime by changing one function call. In doing so, it removes an exaggerated runtime cost by taking away an additional call in the for loop inside the triple for loop of our velocity update and adding a one time call to the timestep update.
<br/>
For the following example grid, each implementation has slightly different buffers. demo grid buffer changes
<br/>
The switch in what buffers are used means that as we are iterating over the boids inside a cell index, this
```
int on_boid = particleArrayIndices[given_index];
if (on_boid == particle_index) { continue; }
glm::vec3 boid_position = pos[on_boid];</code></pre>
		can be shortened just to this
	</p>
	<div class="box">
		if (given_index == particle_index) { continue; }
		glm::vec3 boid_position = pos[given_index];
	</div>
```

This change is because for the simple grid implementation, the given index of a boid in the cell does not match the same index in its position and velocity buffers since the cell's one is out of order. In the simple implementation, we use a buffer that maps this given_index to the appropriate index in the positions and velocity buffers. To fix this, in the simulationStep we actually shuffle the elements in our position and velocity buffers to match the same ordering as that of the grid cell index buffer. That way, the cell index that we're iterating over is the same index that corresponds to the position and velocity values in those buffers as well.
	
### Additional Optimizations
An additional optimization that I'd like to implement (tbd) is a radius intersection check instead of the generic bounds. Doing this check would even further optimize the coherent implementation for even more boids. The idea is that instead of doing a generic min to max dimensions check, within the min to max dimensions also add a check for if the nearest corner of the grid cell to the boid (that the boid is not already in) is within the max_distance. Following our example images from scattered - we've culled an additional seven cells even for such a simple example. radius check

## Resources:
* Inspired by Penn's CIS 565's [Boids Project](https://github.com/CIS565-Fall-2018/Project1-CUDA-Flocking)
* [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway's_Game_of_life)
* [Boids](https://www.vergenet.net/%7Econrad/boids/pseudocode.html) as explained by [Conrad Parker](https://www.vergenet.net/~conrad/) on vergenet
* [Ant Bridges](https://www.quantamagazine.org/the-simple-algorithm-that-ants-use-to-build-bridges-20180226)
* Numberphile's [Video Explanation](https://www.youtube.com/watch?v=R9Plq-DlgEk)
