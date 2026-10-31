/* Original field adventures and untimed puzzle rules. No browser dependency. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.WildkinAdventures=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const POINTS=[[0,2],[1,2],[1,1],[2,1],[2,0],[1,3],[2,3],[3,2],[4,1],[4,2],[3,4],[4,3]];
const EDGES=[[0,1],[1,2],[2,3],[3,4],[3,7],[1,5],[5,6],[6,7],[6,10],[7,8],[8,9],[7,9],[9,11],[11,10]];
const KINDS=['brief','crossroads','battle','switch','clue','choice','puzzle','gate','nest','captain','secret','relay'];
const M=(title,goal,team,rows)=>({title,goal,team,rooms:rows.map((row,id)=>{const [name,text]=row.split('|');return {id,kind:KINDS[id],name,text};})});
const REGIONS=[
 {mechanic:'Irrigation channels',effect:'patient',effectText:'Guard, then attack: your next attack gains 15% power.',request:'Tamsin’s seed library',requestText:'Tamsin is rebuilding a library of living seeds. Bring field notes from two hidden seed beds. Decide whether the seeds belong in the village garden or in the wild.',resolutions:['Plant a village seed garden','Return the seeds to the wild'],restored:['Children tend the new seed garden beside Tamsin’s tower.','Wildflowers return along the paths, each growing where a companion chose to rest.'],missions:[
 M('The bellroot aqueduct','Carry water to the dry bellroot relay.',[1,0,4],[
 'Dry gate|Tamsin points to a root curled around an empty channel. The relay will sing again when water reaches its crown.',
 'Two ways uphill|A thorny ridge leads past restless sentries. Below, a quiet ditch leads to the old irrigation controls. Both reach the relay.',
 'Briar patrol|Flintail and Mosslet guard a nest beneath the broken aqueduct. Read their intentions and give them room to settle.',
 'Ridge crank|A crank above the nest raises a wooden sluice. Turning it opens a dry route straight to the upper gate.',
 'The gardener’s rubbing|A stone rubbing shows the original water route: east, east, south, south, east. It also marks a forgotten seed bed.',
 'A thirsty traveler|A Pebblin has tipped its drinking bowl. Share a tonic to help it now, or build a shaded bowl from fallen bark.',
 'The bent channels|Rotate the channel tiles. Water enters the left edge of the top-left tile and must leave the right edge of the bottom-right tile.',
 'The listening gate|The roots test your approach. The ridge crank opens a stone stair; restored water opens a cool tunnel beside it.',
 'A nest above the water|A Bumbloom watches the new flow. You can win its trust through battle or try a gentle bond.',
 'Keeper of the sluice|A three-companion patrol mistakes the opening gate for a flood. Guard, then strike to show control.',
 'The first seed bed|The rubbing and the flowing channel reveal a bed of sleeping bellroot seeds. Record them without disturbing their roots.',
 'A bellroot drinks|Water curls around the relay. A living note joins the seed-bell, and the meadow has one less reason to fear.'
 ]),
 M('The orchard of leaning bells','Free the orchard relay from a fallen tree.',[3,2,0],[
 'The fallen orchard|Tamsin’s orchard has bent toward a silent bell. The oldest tree lies across the relay bridge.',
 'Roots or brook|A path through the roots holds stubborn guardians. A brook path reaches the orchard’s water wheel.',
 'Orchard wardens|Bumbloom and Brookit circle a fallen nest. Their shields reward patience over repeated heavy attacks.',
 'Counterweight shed|A wooden weight can lift the fallen trunk. The wardens have left the rope clear now that they trust you.',
 'The beekeeper’s map|A strip of bark marks a rare seed bed beyond the brook. The channel sketch has five connected turns.',
 'The small bridge|An elderly seedkeeper cannot cross the brook. Spend a tonic to ease the journey, or build handrails from loose branches.',
 'Orchard water wheel|Turn the channel tiles until water reaches the wheel. The wheel lifts the tree without cutting it.',
 'A choice of crossings|A counterweight lifts the bridge from above. The wheel lifts it from below. Both keep the old tree alive.',
 'A sheltered visitor|A Brookit has made a home under the fallen trunk. Approach carefully; this place will remain its home.',
 'The leaning bell patrol|Three orchard companions test your timing. Guard prepares a stronger reply on this sheltered trail.',
 'The second seed bed|Following the bark map reveals seeds tucked in the roots of the living bridge. Add a drawing to Tamsin’s notes.',
 'Bells in the branches|The bridge rises and the orchard relay rings. The old tree survives, now holding a path instead of blocking one.'
 ]),
 M('The lantern-grass hollow','Wake the relay hidden beneath the meadow.',[4,3,2],[
 'Grass that glows|Tiny lights trace a tunnel under the hollow. Tamsin’s last relay is somewhere below their roots.',
 'The burrow fork|A high burrow passes a stone patrol. A low burrow follows the sound of trapped spring water.',
 'Hollow sentries|Pebblin and Bumbloom brace the tunnel roof. Their steady defense makes a well-timed burst valuable.',
 'The stone latch|A stone latch releases the upper burrow. Its handle is worn smooth by many generations of small paws.',
 'Light on old stone|Lantern-grass illuminates a channel diagram. Beside it is a drawing of seeds growing in darkness.',
 'A frightened burrower|A young Wildkin is afraid to leave a shaking alcove. Offer a tonic, or make a safe trail of glowing grass.',
 'The spring below|Rotate the buried channels to release the spring toward the relay. No water is lost if you take time to think.',
 'The breathing door|The high burrow’s latch opens one side. The spring opens the other. Cool air reveals the way ahead.',
 'A stone-hearted friend|A Pebblin rolls out of the dark, carrying a lantern seed on its back. It is curious about your companion.',
 'The hollow’s watch|The final patrol gathers under the lantern-grass. Its members protect one another; watch for ward turns.',
 'The hidden nursery|The light diagram leads to a seed nursery tended by wild companions. Record its shape and leave the seeds rooted.',
 'A note underground|The buried relay hums through the meadow. Above you, lantern-grass lights a path all the way home.'
 ])]},
 {mechanic:'Echo sequences',effect:'variety',effectText:'Alternating attack types gains 15% power; repeats receive no bonus.',request:'Orin’s lost pages',requestText:'Two hidden chambers hold pages from Orin’s sister’s atlas. Recover the notes, then choose whether the atlas guides travelers or protects the quiet paths.',resolutions:['Publish safe paths for travelers','Keep the quiet refuges unmarked'],restored:['New trail signs lead lost travelers out of the repeating forest.','Blank spaces on Orin’s map shelter the shyest woodland companions.'],missions:[
 M('The four-voice belfry','Restore the belfry’s true echo.',[5,6,9],[
 'Orin’s ribbon|Orin ties a blue ribbon to the first tree. He asks you to find the voice that belongs to the belfry, not its reflection.',
 'Above or below the echo|The canopy stair crosses a watchful patrol. The moss stair reaches four speaking stones.',
 'The false callers|Duskit and Glimpup repeat each other’s calls. Alternate your attacks when the mirror appears.',
 'Bell rope loft|A rope tied to the real bell opens the high door. The knot is a traveler’s knot, not a trap.',
 'A page in the eaves|Ione wrote four symbols here in order. The same symbols are carved into the moss stair’s speaking stones.',
 'The unanswered call|A lost traveler keeps answering the wrong echo. Share a tonic, or mark the true direction with Orin’s ribbon.',
 'Four speaking stones|Repeat the written sequence. The symbols remain visible, and a wrong note simply begins the phrase again.',
 'One true doorway|The bell rope and the speaking stones both point toward a door that casts only one shadow.',
 'A quiet listener|A Wispette drifts inside a silent bell. It listens before deciding whether to approach.',
 'The belfry chorus|Three woodland companions challenge you in sequence. Changing your attack rhythm keeps their echoes uncertain.',
 'An atlas leaf|The eaves page and the complete phrase reveal Ione’s hidden atlas note. It names the people who used this safe crossing.',
 'A voice returned|The bell rings once. This time the forest answers once, and Orin’s blue ribbon points toward home.'
 ]),
 M('The hall of borrowed footsteps','Separate the archive’s memories from its traps.',[7,8,5],[
 'Footprints ahead|Your footsteps sound before your feet touch the floor. Orin suspects a beacon memory is running backward.',
 'Gallery or cellar|A gallery leads past memory sentries. A cellar follows four marked floorstones beneath the echoes.',
 'Memory sentries|Fernix and Shroomble guard a door that opens to visitors with different rhythms. Repeating one move can waste an opening.',
 'The gallery pulley|The sentries move aside from a pulley that draws back a curtain of wooden chimes.',
 'The first visitor|A guest book shows the order of four heraldic signs. Ione drew the same order beside a missing atlas page.',
 'A memory that hurts|A traveler keeps reliving a wrong turn. Offer a tonic, or help them leave a new mark on the hall.',
 'The floorstone phrase|Answer the four signs in their written order. The hall accepts a careful answer as readily as a quick one.',
 'Curtain of chimes|The pulley opens the chimes from above. The right phrase stills them from below.',
 'A canopy guest|A Fernix watches dust gather on the guest book. A friendship could give this old hall a new memory.',
 'The borrowed chorus|Three keepers test your ability to change plans. Each incoming intention is real, even in this strange hall.',
 'A page left open|The guest book and the finished phrase open a small drawer. Ione’s atlas page remembers a refuge beyond the hall.',
 'Footsteps behind|Your steps finally follow you. The relay gives back the present, leaving the old visitors their memories.'
 ]),
 M('The unmarked door','Open the woodland refuge without breaking its silence.',[9,5,8],[
 'A door without a name|Orin has left a blank space on his map. A refuge exists here, but its entrance changes with the echoes.',
 'The owl stair|One stair climbs through guardian branches. Another descends to four wooden owls with carved symbols.',
 'Branch guardians|Wispette and Duskit hover above the stair. Their interrupted rhythms invite deliberate, varied attacks.',
 'The branch latch|A living branch bends into a latch. It opens only after its guardians choose to let you pass.',
 'The owls’ inscription|An inscription orders four symbols from dawn to sleep. Beneath it, Ione has sketched a hidden writing desk.',
 'A sleeping scout|A Glimpup is keeping watch after a long night. Share a tonic, or build a shaded resting place.',
 'Four wooden owls|Touch the owls in the inscribed order. You may read the order for as long as you wish.',
 'The quiet threshold|The branch latch and the completed owl song both reveal the same door. It makes no sound when it opens.',
 'A spore-lit guest|A Shroomble has arranged tiny lights beside the door. It may welcome a traveler who respects the refuge.',
 'The silent council|Three guardians measure your choices without a word. Their mirrored turns make predictable attacks less useful.',
 'The hidden writing desk|The inscription and the owl phrase reveal Ione’s last woodland atlas page. There is still room for another traveler’s name.',
 'A refuge remains|The relay wakes with a soft light. Orin can find this door again without telling every stranger where it lies.'
 ])]},
 {mechanic:'Tide vessels',effect:'tide',effectText:'Every third turn favors elemental bursts: Burst gains 20% power.',request:'Neri’s reef shelters',requestText:'Record two hidden nurseries beneath the crossing. Neri can restore either the old rescue lamp or a protected reef passage with what you learn.',resolutions:['Restore the rescue lamp','Protect the reef passage'],restored:['A warm rescue lamp guides late boats safely through the crossing.','A shaded channel gives young reef companions a quiet route to the sea.'],missions:[
 M('The lighthouse cistern','Bring the correct water measure to the lighthouse relay.',[10,11,13],[
 'A lamp beneath the tide|Neri’s lower lighthouse has filled with seawater. Its relay waits above a locked cistern gate.',
 'Catwalk or pumps|A high catwalk crosses a shell patrol. A pump room offers a quieter way to measure the water.',
 'Shell patrol|Shellip and Finfizz defend the cistern. Their protective turns are chances to prepare.',
 'The catwalk wheel|A wheel above the cistern opens an inspection door. The patrol leaves the platform steady beneath your feet.',
 'The tidekeeper’s chalk|A chalk mark shows two vessel sizes and the exact amount needed. Another mark points toward a hidden nursery.',
 'The tangled fisher|A fisher has caught a rope around the pump. Offer a tonic while they rest, or untangle the rope together.',
 'Two tide vessels|Fill, empty and pour between the vessels until one holds the marked amount. The water is an untimed puzzle, not a supply.',
 'The cistern gate|The catwalk wheel releases the gate from above. The correct water measure releases the pressure beneath it.',
 'A coral visitor|A Coralyn floats in a pool where the lighthouse beam once reached. It follows your companion’s reflection.',
 'Cistern keepers|Three companions test your timing against the tide. Every third turn offers a stronger elemental burst.',
 'A nursery in shadow|The chalk mark and balanced cistern reveal a sheltered nursery. Sketch its entrances for Neri.',
 'The low lamp burns|The relay turns the lighthouse’s lowest lens toward open water. A clear beam crosses the tide.'
 ]),
 M('The pearl engine','Restart the crossing’s gentle tide engine.',[12,11,10],[
 'An engine made of shells|Neri has found a tide engine built to move water without trapping fish. Its relay has stopped turning.',
 'Shells or sluices|The shell walkway is guarded by reef kin. The sluice passage leads toward two measuring vessels.',
 'Reef attendants|Coralyn and Finfizz circle the engine. Their recovery and charging rhythms reward careful timing.',
 'The pearl lever|A polished lever releases the engine’s upper clutch. Nothing is taken from the living pearl beds.',
 'A mechanic’s shell|Neri’s old diagram marks the required measure. Its margin shows a refuge hidden behind the engine.',
 'A tired diver|A diver has spent too long searching the wrong channel. Share a tonic, or help haul the heavy guide rope.',
 'The engine measures|Use the two vessels to find the marked amount. Pouring moves as much water as the receiving vessel can hold.',
 'The gentle clutch|The pearl lever and the measured water both release the clutch. The engine begins to breathe with the sea.',
 'A spray in the gears|A Sprayfin keeps the engine clean. It circles once before letting you approach.',
 'The engine watch|Three keepers test the restarted engine. Time your bursts with the third-turn tide.',
 'The pearl nursery|The shell diagram and working measures reveal a refuge behind a screen of empty shells. Record it quietly.',
 'Water without walls|The relay turns. Water moves through the engine while every living thing keeps a way out.'
 ]),
 M('The wreck’s second lantern','Relight the wreck’s relay without raising the whole ship.',[14,13,12],[
 'A light below deck|Neri sees a second lantern glowing under the wreck. Its relay could guide creatures away from the broken hull.',
 'Deck or bilge|The deck passes a lantern patrol. The bilge leads to a pair of old ballast vessels.',
 'Lantern patrol|Mistmoth and Sprayfin protect the captain’s last lamp. Watch the charge before committing to an attack.',
 'The deck capstan|The capstan lifts a collapsed beam away from an upper hatch. The old ship settles safely.',
 'The captain’s measure|A page lists the ballast sizes and a safe measure. A small nursery is drawn beneath a cargo shelf.',
 'A cold survivor|A stranded shorekeeper waits in an air pocket. Offer a tonic, or guide them out along the new rope.',
 'Ballast balance|Measure the marked amount using the two ballast vessels. You can empty and refill without harming the ship.',
 'The lantern hatch|The capstan clears the hatch from above. Balanced ballast takes its weight from below.',
 'A mist in glass|A Mistmoth tends a lantern filled with sea mist. It is curious about a bell that can sing underwater.',
 'The captain’s watch|Three companions gather around the second lantern. Let the tide guide your strongest bursts.',
 'A shelf of small lives|The captain’s drawing and balanced ballast reveal the nursery below a cargo shelf. Neri will keep it undisturbed.',
 'The second lantern|The relay lights a safe route beside the wreck. The ship stays where the reef has made it a home.'
 ])]},
 {mechanic:'Furnace panels',effect:'variety',effectText:'Alternating attack types gains 15% power; repeats receive no bonus.',request:'Fenn’s cooling kilns',requestText:'Record two hidden cooling chambers for Fenn. Choose whether their safe heat should warm the village or maintain the mountain bridges.',resolutions:['Warm the village shelters','Keep the bridges frost-free'],restored:['Warm stone benches welcome travelers into the village shelters.','The mountain bridges stay clear, and every village keeps a way across.'],missions:[
 M('The kiln that remembers','Cool the old kiln and release its trapped relay.',[15,16,17],[
 'A fire that repeats|Fenn’s first kiln replays the same flare every few breaths. A relay is trapped behind its hottest wall.',
 'Gantry or valves|A gantry reaches a guarded latch. A valve room can cool the wall without crossing the flare.',
 'Kiln attendants|Coalbit and Ashhopper guard the gantry. Change your attack rhythm when they prepare to defend.',
 'The lifting hook|A heavy hook draws the kiln’s upper door aside. Its heat shield still works.',
 'Fenn’s first lesson|A diagram explains that each panel changes itself and its neighbors. It also marks a hidden cooling chamber.',
 'The broken glove|An apprentice has lost a heat glove. Share a tonic, or stitch a spare glove from the repair kit.',
 'The nine panels|Cool every panel. Pressing one toggles it and its up, down, left and right neighbors.',
 'The kiln’s door|The hook clears the high opening. Cooled panels release the lower wall. Both lead away from the repeating flame.',
 'An ember guest|A Smolderoo warms a cup of spring water. It may accept a companion who does not fear a little heat.',
 'Keepers of the flare|Three kiln kin test a changing sequence of attacks. Their charged hits are honest warnings.',
 'The first cooling chamber|The diagram and cooled panels reveal a chamber carved by old spring water. Record its safe heat for Fenn.',
 'A fire allowed to end|The relay cools and the kiln completes its last flare. A new fire can now begin when someone actually needs it.'
 ]),
 M('The black-glass foundry','Free the foundry relay from a loop of reflected fire.',[17,18,15],[
 'Reflections in the furnace|Fenn sees flames in cold glass. The foundry relay is repeating light instead of releasing heat.',
 'Crane or cooling floor|A crane platform crosses a glass patrol. A cooling floor offers a panel-controlled route.',
 'The glass patrol|Basalisk and Smolderoo guard reflected flames. Their weakening attacks reward a change of plan.',
 'Crane brake|The crane brake lifts a black-glass plate without shattering it. A narrow upper path appears.',
 'The cooling stencil|A stencil marks neighboring panels and a safe glass chamber. Its ink was made before the foundry was abandoned.',
 'The heavy pane|A smith struggles with a pane that is warm on only one side. Share a tonic, or help fit a padded carrying frame.',
 'Glass cooling grid|Cool the nine panels by toggling a panel and its orthogonal neighbors. The reflections are only lights.',
 'A transparent door|The crane holds one edge open. Cooled panels release the other, letting the foundry lose its trapped heat.',
 'A spark between panes|A Cindermite carries a tiny light through the glass. It watches your companion’s shadow.',
 'The reflected council|Three foundry companions test your rhythm. A repeated move misses the trail’s changing advantage.',
 'A chamber of clear glass|The stencil and cooled grid reveal a chamber where heat can leave slowly. Sketch it for the bridge smith.',
 'Glass without fire|The relay sends one clean beam through the foundry. The old reflections finally go dark.'
 ]),
 M('The bridge under the mountain','Reopen the relay passage beneath Emberfall.',[19,17,16],[
 'A buried crossing|Fenn’s oldest bridge runs through the mountain itself. Its relay is blocked by a wall of trapped warmth.',
 'Stone ribs or vents|A route along stone ribs passes sentries. A lower vent route reaches the cooling panels.',
 'Underbridge sentries|Cindermite and Basalisk patrol the ribs. Static and weakening make each announced intention useful information.',
 'The rib brace|A fitted brace opens a passage between the stone ribs. The bridge remains supported.',
 'A mason’s tablet|The tablet explains the cooling grid and marks a chamber where travelers once sheltered beneath the mountain.',
 'The last cart|A cart driver has stopped in the warm tunnel. Share a tonic, or help replace a cracked wheel wedge.',
 'The vent grid|Cool every vent panel. Each press changes its own vent and the four neighboring vents.',
 'The warm wall|The brace opens a path through the ribs. The cooled vents make a second path along the floor.',
 'A springing shadow|An Ashhopper bounds along the stone ribs. It stops to watch your bell catch the light.',
 'The underbridge watch|Three mountain kin test your plans beneath the low ceiling. Varying attacks keeps a useful opening.',
 'The travelers’ chamber|The mason’s tablet and cooled vents reveal a quiet chamber. Fenn can turn its gentle warmth toward a good use.',
 'A bridge returns|The relay glows beneath the mountain. The path does not fight the heat; it gives the heat a way out.'
 ])]},
 {mechanic:'Wind navigation',effect:'relay',effectText:'Switch to a different element, then attack: gain 20% power.',request:'Sola’s safe landings',requestText:'Map two hidden lee shelters for Sola. Choose whether pilots should use them for a rescue route or a quiet research route above the clouds.',resolutions:['Mark a rescue route','Mark a research route'],restored:['Rescue gliders follow bright flags between the sheltered landings.','Quiet gliders carry field researchers above the cloud nurseries.'],missions:[
 M('The glider’s long way home','Reach the stranded glider’s relay.',[20,21,22],[
 'Sola’s tether|Sola has tied a glider to a motionless cloud. Its relay is the only part still moving.',
 'Cable or wind|The cable route crosses a sky patrol. The cloud route can carry a small glider through the wind grid.',
 'Sky patrol|Voltkit and Cloudleap guard the cable. Switching elements before an attack gives this trail a stronger reply.',
 'The cable winch|A winch pulls a steady line to the glider. It leaves the cloud route open for anyone who follows.',
 'A pilot’s chart|The chart shows storm cells, local wind and a hidden lee shelter. Wind arrows move you after your own step.',
 'A frayed harness|A pilot needs a safe harness before taking off. Share a tonic while they rest, or help braid a new tether.',
 'Across the wind|Navigate the glider to the landing flag. Storm cells and gusts reset only your position, with no loss or timer.',
 'The glider’s rail|The cable reaches the rail directly. The wind route lands at its quiet side.',
 'A root in the clouds|A Zapling has anchored itself to the glider’s wooden rail. It greets your companion with a soft spark.',
 'The tethered team|Three sky companions test your handoffs. Switching to a different element prepares a stronger attack.',
 'A lee behind the cloud|The pilot’s chart and a completed wind crossing reveal a sheltered landing. Mark its safe approach for Sola.',
 'A glider released|The relay hums. Sola can bring the glider home without tearing the cloud apart.'
 ]),
 M('The observatory in the gale','Reconnect the observatory relay.',[22,23,21],[
 'An observatory turned away|Sola’s old observatory faces a storm that has not moved in years. Its relay is hidden behind the wind vanes.',
 'Ridge line or glide path|The ridge line passes weather sentries. A training glide path leads around the vanes.',
 'Weather sentries|Zapling and Stormite protect the ridge. Their charging and weakening rhythms reward good team handoffs.',
 'The vane handle|A handle folds the outer vane and opens a ridge stair. The great lens can stay where it belongs.',
 'The observer’s chart|A star observer has marked the storm grid and a lee pocket behind the lens. The arrows describe local gusts.',
 'The dropped notebook|An observer cannot carry a heavy notebook across the ridge. Share a tonic, or make a waterproof sling.',
 'The vane crossing|Guide the small glider through the wind grid. The flag marks a safe landing beyond the vanes.',
 'The lens threshold|The folded vane opens the ridge stair. The glider can reach a lower lens platform.',
 'A current in the glass|A Stormite circles the observatory lens. It is looking for a cloud that finally moves.',
 'The observatory council|Three weather kin test your party’s different elements. A thoughtful switch earns a stronger follow-up.',
 'The lens lee|The observer’s chart and finished glide reveal a landing hidden behind the great lens. Record the shelter, not the storm.',
 'The lens turns|The relay moves the observatory toward a new patch of sky. There will always be something else to discover.'
 ]),
 M('The thunder archive','Carry the archive’s relay signal through the clouds.',[24,20,23],[
 'Messages without a route|Sola finds thunder messages waiting in glass jars. The archive relay has no clear route to send them home.',
 'Lightning rod or cloud path|A rod walkway crosses a thunder patrol. A cloud path can guide a glider between the jars.',
 'Thunder patrol|Crackluna and Voltkit guard the walkway. Their first pressure can be answered by switching to a different element.',
 'The rod switch|A grounded switch opens a shielded walkway. The jars can remain safely on their shelves.',
 'The courier’s chart|A courier has marked gust arrows and a lee shelf. A safe delivery needs a planned landing, not a fast one.',
 'The anxious courier|A courier has been waiting for an impossible clear sky. Share a tonic, or help build a grounded message case.',
 'The courier’s crossing|Guide the glider to the landing flag. You may try every gust safely before choosing a route.',
 'The archive gate|The grounded walkway reaches the archive gate. The glider lands beside its sheltered edge.',
 'A traveler of the air|A Crackluna drifts beside an open jar. It has carried one of these messages for a long time.',
 'The thunder council|Three sky kin keep the last signal safe. Good handoffs among different elements open their defenses.',
 'The courier’s lee|The chart and completed crossing reveal a shelf protected from the gale. Sola can make a route through it.',
 'Messages delivered|The relay sends a clear pulse through the clouds. The thunder carries a message instead of a command.'
 ])]},
 {mechanic:'Star tiles',effect:'variety',effectText:'Alternating attack types gains 15% power; repeats receive no bonus.',request:'Ione’s open archive',requestText:'Recover records from two hidden memory alcoves. Decide whether the restored archive should keep personal memories private or share its lessons with travelers.',resolutions:['Keep the personal memories private','Share the lessons with travelers'],restored:['Private alcoves keep the old keepers’ memories safe without locking the archive doors.','Travelers add their own lessons to a growing, open archive.'],missions:[
 M('The garden of unfinished days','Restore the garden relay without fixing its future.',[25,28,26],[
 'Tomorrow’s empty bed|Ione leads you to a garden bed that Aster never planted. Its relay waits for a day that has not happened.',
 'Memory stair or star path|The memory stair passes garden witnesses. The star path leads through a small sliding chart.',
 'Garden witnesses|Astroling and Moonhare guard the stair. Different attack rhythms show them that this is a new day.',
 'The gardener’s latch|A latch opens the memory stair. It was built to be used by living hands, not preserved forever.',
 'The unfinished chart|A numbered star chart shows a blank space in its final corner. Its margin marks a memory alcove.',
 'An old promise|An archivist keeps promising to return tomorrow. Share a tonic, or help leave a note for whoever visits next.',
 'The moving chart|Slide adjacent tiles into the empty space. Restore the numbered chart with the blank in its final corner.',
 'The garden threshold|The latch opens the memory stair. The completed chart opens a path through the unplanted bed.',
 'A new starlight|An Astroling circles the empty bed. It is waiting to see what someone chooses to grow.',
 'Witnesses of tomorrow|Three sanctuary kin test whether you can change your plan. The trail rewards alternating attacks.',
 'A memory with room|The chart and its margin reveal a record of Aster’s first garden. Leave space beside it for another gardener.',
 'An unfinished day|The relay lights the empty bed. It remains empty, ready for a real tomorrow instead of a perfect memory.'
 ]),
 M('The archive’s unlocked wing','Open the wing that Aster closed to protect everyone.',[26,27,25],[
 'An unopened gift|Ione finds a wing filled with gifts that never reached their owners. Its relay has been guarding a closed door.',
 'Gallery or chart room|The gallery crosses rune sentries. The chart room offers a way to solve the door’s moving star lock.',
 'Rune sentries|Runefox and Orblet guard the gifts. Their weakened and charging turns call for a varied attack plan.',
 'The gallery handle|A handle opens the upper gallery. The gifts remain labeled with the names of their intended owners.',
 'The keeper’s chart|A numbered chart records the door’s final arrangement. A small mark points toward a personal memory alcove.',
 'A name still waiting|An archivist finds a gift with their own name. Share a tonic, or help write a reply to its long-ago sender.',
 'The star lock|Slide tiles into the blank space until the chart is ordered. The blank belongs in the final corner.',
 'The unlocked wing|The gallery handle opens one door. The restored chart opens another. Neither door needs to be locked again.',
 'A rune beside a name|A Runefox has been guarding one of the gifts. It is ready to choose a new task.',
 'The archive council|Three keepers test your changing rhythm. Their mirrors cannot hold a plan that keeps growing.',
 'A personal alcove|The chart mark and its restored order reveal a quiet record of the old keepers. Ione asks you to consider who should read it.',
 'A gift delivered|The relay opens the wing. The gifts can finally reach people who are free to accept them.'
 ]),
 M('The comet’s last orbit','Let the comet relay finish the journey it began.',[29,28,27],[
 'A comet held still|Ione shows you a comet caught beside the sanctuary. Its relay keeps replaying the moment before it lands.',
 'Crater ridge or star trail|The crater ridge passes comet guardians. A star trail leads through the relay’s shifting chart.',
 'Comet guardians|Stardrift and Moonhare protect the crater. Their first fierce attacks make preparation valuable.',
 'The crater latch|A latch lowers the ridge bridge. It opens a path without touching the suspended comet.',
 'The falling chart|A numbered chart traces the comet’s final orbit. A margin note marks a hidden memory alcove.',
 'The last observer|An observer is afraid to see the comet move. Share a tonic, or help build a safe place to watch it land.',
 'The last orbit|Slide the chart back into order. Leave its final corner empty so the comet has somewhere to go.',
 'The crater threshold|The ridge bridge reaches the relay. The ordered chart reveals a lower path beside the comet.',
 'A spark that wanders|An Orblet has followed the comet across the wilds. Its journey does not have to end here.',
 'The comet council|Three sanctuary kin test your final preparations. Change attacks, watch intentions and leave room for a different answer.',
 'The observer’s memory|The chart note and finished orbit reveal a record of Aster watching the sky as a child. It was a hopeful memory before it became a command.',
 'A comet lands|The relay releases its hold. The comet touches the crater, and the sanctuary survives something it could not keep still.'
 ])]}
];
const PIPE_TARGET=[10,10,12,6,9,5,3,12,3];
const ECHO_NAMES=['Sun','Leaf','Rain','Bell'];
const GOAL_TILES=[1,2,3,4,5,0];
const rotate=mask=>((mask<<1)&15)|(mask>>3);
const neighbors=room=>EDGES.flatMap(([a,b])=>a===room?[b]:b===room?[a]:[]);
const blankState=()=>({version:1,active:null,runs:{},requests:{}});
const runState=(z,r)=>({position:0,visited:[0],cleared:[],branch:null,help:null,clue:false,evidence:false,completed:false,puzzle:createPuzzle(z,r)});
function tileMoves(cells){const blank=cells.indexOf(0),x=blank%3,y=Math.floor(blank/3);return [blank-3,blank+3,blank-1,blank+1].filter(i=>i>=0&&i<6&&Math.abs(i%3-x)+Math.abs(Math.floor(i/3)-y)===1);}
function slide(cells,index){const next=cells.slice(),blank=next.indexOf(0);[next[index],next[blank]]=[next[blank],next[index]];return next;}
function togglePanel(mask,index){let result=mask;for(const i of [index,index-3,index+3,index-1,index+1])if(i>=0&&i<9&&Math.abs(i%3-index%3)+Math.abs(Math.floor(i/3)-Math.floor(index/3))<=1)result^=1<<i;return result;}
function createPuzzle(zone,route){
 if(zone===0)return {kind:'pipes',route,cells:PIPE_TARGET.map((v,i)=>{for(let n=0;n<(i+route+1)%4;n++)v=rotate(v);return v}),moves:0};
 if(zone===1)return {kind:'echo',route,sequence:[0,2,1,3,1].slice(0,4+(route===2?1:0)).map(n=>(n+route)%4),notes:[],moves:0};
 if(zone===2)return {kind:'tide',route,vessels:[0,0],moves:0};
 if(zone===3){let mask=0;for(const n of [[0,4],[1,5,7],[2,3,6,8]][route])mask=togglePanel(mask,n);return {kind:'furnace',route,mask,moves:0};}
 if(zone===4)return {kind:'wind',route,position:10,moves:0};
 return {kind:'stars',route,cells:[[5,4,2,0,1,3],[5,4,3,0,2,1],[5,3,1,2,4,0]][route].slice(),moves:0};
}
function tideInfo(route){const [a,b,target]=[[3,2,1],[5,3,4],[7,4,5]][route];return {a,b,target};}
function windInfo(route){return {storms:[[6,8,16,18],[6,12,18,23],[6,8,17,21]][route],gusts:[{7:1,12:1,17:-1},{7:-1,17:1},{7:1,12:-1}][route],goal:14};}
function windStep(position,action,route){const {storms,gusts}=windInfo(route),x=position%5,y=Math.floor(position/5),delta={north:[0,-1],east:[1,0],south:[0,1],west:[-1,0]}[action];if(!delta)return position;let nx=x+delta[0],ny=y+delta[1];if(nx<0||nx>=5||ny<0||ny>=5)return position;let dest=ny*5+nx;if(storms.includes(dest))return 10;if(gusts[dest]){ny+=gusts[dest];dest=ny*5+nx;}return ny<0||ny>=5||storms.includes(dest)?10:dest;}
function pipesSolved(cells){if(!(cells[0]&8))return false;const seen=new Set([0]),queue=[0],steps=[[1,-3,4],[2,1,8],[4,3,1],[8,-1,2]];for(const index of queue){if(index===8&&(cells[8]&2))return true;for(const [port,delta,other] of steps){const next=index+delta;if(next<0||next>8||Math.abs(next%3-index%3)+Math.abs(Math.floor(next/3)-Math.floor(index/3))!==1)continue;if((cells[index]&port)&&(cells[next]&other)&&!seen.has(next)){seen.add(next);queue.push(next);}}}return false;}
function puzzleSolved(p){switch(p.kind){case'pipes':return pipesSolved(p.cells);case'echo':return p.notes.length===p.sequence.length&&p.notes.every((n,i)=>n===p.sequence[i]);case'tide':return p.vessels.includes(tideInfo(p.route).target);case'furnace':return p.mask===0;case'wind':return p.position===windInfo(p.route).goal;case'stars':return p.cells.every((n,i)=>n===GOAL_TILES[i]);default:return false;}}
function puzzleActions(p){if(puzzleSolved(p))return [];switch(p.kind){case'pipes':return Array.from({length:9},(_,i)=>'rotate:'+i);case'echo':return ECHO_NAMES.map((_,i)=>'note:'+i);case'tide':return ['fill-a','fill-b','empty-a','empty-b','pour-a','pour-b'];case'furnace':return Array.from({length:9},(_,i)=>'panel:'+i);case'wind':return ['north','east','south','west'];case'stars':return tileMoves(p.cells).map(i=>'tile:'+i);default:return [];}}
function puzzleStep(p,action){if(!puzzleActions(p).includes(action))return p;const next=JSON.parse(JSON.stringify(p));next.moves++;
 const index=Number(action.split(':')[1]);switch(p.kind){case'pipes':next.cells[index]=rotate(p.cells[index]);break;case'echo':next.notes=p.notes.concat(index);if(!next.notes.every((n,i)=>n===p.sequence[i]))next.notes=index===p.sequence[0]?[index]:[];break;
 case'tide':{const {a,b}=tideInfo(p.route),[x,y]=p.vessels;const pourA=Math.min(x,b-y),pourB=Math.min(y,a-x);next.vessels={'fill-a':[a,y],'fill-b':[x,b],'empty-a':[0,y],'empty-b':[x,0],'pour-a':[x-pourA,y+pourA],'pour-b':[x+pourB,y-pourB]}[action];break;}
 case'furnace':next.mask=togglePanel(p.mask,index);break;case'wind':next.position=windStep(p.position,action,p.route);break;case'stars':next.cells=slide(p.cells,index);break;}
 return next;
}
function shortest(start,actions,step,goal,key){const queue=[{value:start,path:[]}],seen=new Set([key(start)]);for(let head=0;head<queue.length;head++){const current=queue[head];if(goal(current.value))return current.path;for(const action of actions(current.value)){const value=step(current.value,action),id=key(value);if(!seen.has(id)){seen.add(id);queue.push({value,path:current.path.concat(action)});}}}return null;}
function puzzleHint(p){if(puzzleSolved(p))return null;
 if(p.kind==='pipes'){const index=p.cells.findIndex((n,i)=>n!==PIPE_TARGET[i]);return 'rotate:'+index;}
 if(p.kind==='echo')return 'note:'+p.sequence[p.notes.length];
 const result=shortest(p,puzzleActions,puzzleStep,puzzleSolved,q=>q.kind==='tide'?q.vessels.join(','):q.kind==='furnace'?q.mask:q.kind==='wind'?q.position:q.cells.join(','));return result?.[0]||null;
}
function reachable(run,destination){if(!neighbors(run.position).includes(destination))return false;if(!run.cleared.includes(run.position)&&!run.cleared.includes(destination))return false;
 if(destination===7&&!run.cleared.includes(3)&&!run.cleared.includes(6))return false;
 if(destination===10&&(!run.clue||!run.cleared.includes(6)))return false;
 if(destination===11&&!run.cleared.includes(9))return false;
 return true;
}
function validatePuzzle(p,zone,route){const initial=createPuzzle(zone,route),fail=()=>{throw Error('Invalid field puzzle')};if(!p||p.kind!==initial.kind||p.route!==route||!Number.isSafeInteger(p.moves)||p.moves<0||p.moves>1e9)fail();
 if(p.kind==='pipes'){if(!Array.isArray(p.cells)||p.cells.length!==9||!p.cells.every((v,i)=>{let n=PIPE_TARGET[i];for(let j=0;j<4;j++){if(v===n)return true;n=rotate(n);}return false;}))fail();}
 if(p.kind==='echo'){if(!Array.isArray(p.sequence)||p.sequence.join(',')!==initial.sequence.join(',')||!Array.isArray(p.notes)||p.notes.length>p.sequence.length||!p.notes.every((v,i)=>v===p.sequence[i]))fail();}
 if(p.kind==='tide'){const {a,b}=tideInfo(route);if(!Array.isArray(p.vessels)||p.vessels.length!==2||!p.vessels.every((n,i)=>Number.isInteger(n)&&n>=0&&n<=[a,b][i]))fail();}
 if(p.kind==='furnace'&&(!Number.isInteger(p.mask)||p.mask<0||p.mask>511))fail();
 if(p.kind==='wind'&&(!Number.isInteger(p.position)||p.position<0||p.position>24||windInfo(route).storms.includes(p.position)))fail();
 if(p.kind==='stars'){if(!Array.isArray(p.cells)||p.cells.length!==6||new Set(p.cells).size!==6||!p.cells.every(n=>Number.isInteger(n)&&n>=0&&n<=5))fail();const nums=p.cells.filter(Boolean);let inversions=0;for(let i=0;i<nums.length;i++)for(let j=i+1;j<nums.length;j++)if(nums[i]>nums[j])inversions++;if(inversions%2)fail();}return p;
}
function normalize(input){if(!input)return blankState();if(input.version!==1||typeof input.runs!=='object'||!input.runs||Array.isArray(input.runs)||typeof input.requests!=='object'||!input.requests||Array.isArray(input.requests))throw Error('Invalid field adventure save');const a=JSON.parse(JSON.stringify(input));
 for(const [key,run] of Object.entries(a.runs)){if(!/^[0-5]:[0-2]$/.test(key))throw Error('Invalid field route');const [z,r]=key.split(':').map(Number);if(!run||!Number.isInteger(run.position)||run.position<0||run.position>11)throw Error('Invalid field position');for(const name of ['visited','cleared'])if(!Array.isArray(run[name])||run[name].some(n=>!Number.isInteger(n)||n<0||n>11)||new Set(run[name]).size!==run[name].length)throw Error('Invalid field record');if(!run.visited.includes(run.position)||run.cleared.some(n=>!run.visited.includes(n)))throw Error('Inconsistent field progress');if(![null,'upper','lower'].includes(run.branch)||![null,'aid','craft'].includes(run.help)||typeof run.completed!=='boolean'||typeof run.clue!=='boolean'||typeof run.evidence!=='boolean')throw Error('Invalid field choices');validatePuzzle(run.puzzle,z,r);if(run.hint!==undefined&&run.hint!==null&&!puzzleActions(run.puzzle).includes(run.hint))throw Error('Invalid puzzle hint');run.hint=run.hint||null;if(run.clue!==run.cleared.includes(4)||run.evidence!==run.cleared.includes(10)||run.completed!==run.cleared.includes(11)||run.cleared.includes(6)&&!puzzleSolved(run.puzzle))throw Error('Inconsistent field objectives');if(run.completed&&!run.cleared.includes(11))throw Error('Invalid relay record');}
 if(a.active!==null&&(!/^[0-5]:[0-2]$/.test(a.active)||!a.runs[a.active]))throw Error('Invalid active field route');
 for(const [key,value] of Object.entries(a.requests))if(!/^[0-5]$/.test(key)||![0,1].includes(value))throw Error('Invalid regional request');return a;
}
return {REGIONS,POINTS,EDGES,KINDS,PIPE_TARGET,ECHO_NAMES,GOAL_TILES,blankState,runState,neighbors,createPuzzle,puzzleActions,puzzleStep,puzzleSolved,puzzleHint,tideInfo,windInfo,reachable,normalize};
});
