document.addEventListener("DOMContentLoaded", () => {
    let money = 0;
    let upgradeMultiplier = 1;
    let clickMultiplier = 1;
    let cursorUpgradesBought = 0;
    let cursorCost = 10;

    const UPGRADE_COSTS = {
      grandma: 10,
      factory: 100,
      mine: 1000
    };
    const UPGRADE_MULTIPLIERS = {
      grandma: 1,
      factory: 5,
      mine: 10
    };

    function handleUpgrade(upgradeId) {
        const cost = UPGRADE_COSTS[upgradeId];
        const multiplier = UPGRADE_MULTIPLIERS[upgradeId];
      
        if (money >= cost) {
          money -= cost;
          upgradeMultiplier += multiplier;
          document.getElementById("money").textContent = money;
          document.getElementById(upgradeId).style.display = "none";
      
          // Update the upgrade cost element
          const upgradeElement = document.getElementById(upgradeId);
          const costElement = upgradeElement.querySelector("p");
          costElement.textContent = "Purchased";
        }
      }

      function createCursor() {
        const cursor = document.createElement("div");
        cursor.className = "cursor";
        cursor.style.top = Math.random() * 400 + "px";
        cursor.style.left = Math.random() * 400 + "px";
        cursor.addEventListener("click", () => {
          money += upgradeMultiplier * clickMultiplier;
          document.getElementById("money").textContent = money;
        });
        document.body.appendChild(cursor);
      }  
      
      function faceTowards(element, targetElement) {
        // Get element positions and dimensions using getBoundingClientRect
        const elementRect = element.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
      
        // Calculate center coordinates considering element dimensions
        const elementCenterX = elementRect.left + elementRect.width / 2;
        const elementCenterY = elementRect.top + elementRect.height / 2;
        const targetCenterX = targetRect.left + targetRect.width / 2;
        const targetCenterY = targetRect.top + targetRect.height / 2;
      
        // Adjust angle based on desired facing behavior
        console.log(targetCenterX,targetCenterY,elementCenterX,elementCenterY)
        const dx = targetCenterX - elementCenterX;
        const dy = targetCenterY - elementCenterY;
      
        // Calculate angle
        let angle = Math.atan2(dy, dx) / Math.PI;
      
        // Consider element dimensions for specific adjustments (optional)
        // Add adjustments based on desired behavior and element shapes here
      
        // Set element rotation
        element.style.transform = `rotate(${angle}deg)`;
      }      

      function moveCursors(numCursors) {
        const radius = 100;
        const center = {
          x: cooki.getBoundingClientRect().left + (cooki.getBoundingClientRect().left / 5),
          y: cooki.getBoundingClientRect().top + (cooki.getBoundingClientRect().top / 2)
        };

        const angleStep = (2 * Math.PI) / numCursors;
      
        for (let i = 0; i < numCursors; i++) {
          const angle = i * angleStep;
          const x = center.x + radius * Math.cos(angle);
          const y = center.y + radius * Math.sin(angle);
          const cursor = document.createElement("div");
          cursor.className = "cursor";
          cursor.style.left = `${x}px`;
          cursor.style.top = `${y}px`;
          faceTowards(cursor,cooki);
          document.body.appendChild(cursor);
        }
      }

      function handleCursorUpgrade() {
        if (money >= cursorCost) {
          money -= cursorCost;
          cursorUpgradesBought++;
          clickMultiplier *= 2;
          cursorCost *= 2;
          document.getElementById("money").textContent = money;
          document.getElementById("cursor-count").textContent = cursorUpgradesBought;
          document.getElementById("cursor-cost").textContent = cursorCost;
      
          // Update the cursor upgrade cost element
          const cursorUpgradeElement = document.getElementById("cursor");
          const costElement = cursorUpgradeElement.querySelector("#cursor-cost");
          const countElement = cursorUpgradeElement.querySelector("#cursor-count");
          costElement.textContent = cursorCost;
          countElement.textContent = cursorUpgradesBought;
      
          // Add a setInterval function to automatically click the cooki
          setInterval(() => {
            cooki.click();
          }, 1000);
        }
      }      
      
      function handleCursorUpgrade() {
        if (money >= cursorCost) {
          money -= cursorCost;
          cursorUpgradesBought++;
          cursorCost *= 2;
          document.getElementById("money").textContent = "$"+money;
          document.getElementById("cursor-count").textContent = cursorUpgradesBought;
          document.getElementById("cursor-cost").textContent = cursorCost;
      
          // Update the cursor upgrade cost element
          const cursorUpgradeElement = document.getElementById("cursor");
          const costElement = cursorUpgradeElement.querySelector("#cursor-cost");
          const countElement = cursorUpgradeElement.querySelector("#cursor-count");
          costElement.textContent = cursorCost;
          countElement.textContent = cursorUpgradesBought;
      
          // Move the cursors around the cooki
          moveCursors(cursorUpgradesBought);
      
          // Automatically click the cooki every second
          const clickInterval = setInterval(() => {
            cooki.click();
          }, 1000);
        }
      }      

    const grandmaUpgrade = document.getElementById("grandma");
    grandmaUpgrade.addEventListener("click", () => {
    handleUpgrade("grandma");
    });

    const factoryUpgrade = document.getElementById("factory");
    factoryUpgrade.addEventListener("click", () => {
    handleUpgrade("factory");
    });

    const mineUpgrade = document.getElementById("mine");
    mineUpgrade.addEventListener("click", () => {
    handleUpgrade("mine");
    });

    const cooki = document.getElementById("cooki");
    cooki.addEventListener("click", () => {
        money += upgradeMultiplier * clickMultiplier;
        document.getElementById("money").textContent = "$"+money;
    });

    const cursorUpgrade = document.getElementById("cursor");
    cursorUpgrade.addEventListener("click", handleCursorUpgrade);
    
    document.getElementById("money").textContent = "$"+money;
});