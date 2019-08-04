<script>

export let version = '';

function reloadPage() {
    document.location.reload();
}
</script>

<style>
.new-version-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    width: 100%;

    z-index: 50;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.new-version-container .new-version {
    padding: 20px 30px 20px 30px;
    margin: 0 0 10px 0;

    background-color: rgb(238, 238, 238);
    border: 1px solid #cccccc;
    border-radius: 2px;
}

.new-version-container .new-version-message {
    cursor: pointer;
}

.new-version-container .new-version-message p {
    text-align: center;
    font-weight: 600;

    padding: 0;
    margin: 0;
}

.new-version-container .new-version-value {
    margin: 10px 0 0 0;
    text-align: center;
    font-size: 9px;
}
</style>


<div class='new-version-container'>
    <div class='new-version'>
        <div class='new-version-message' on:click={() => { reloadPage(); }}>
            <p>A new and improved release of this app is now available.</p>
            <p>It includes updates for performance and new features.</p>
            <p>Please tap to update this current version.</p>
        </div>

        <div class='new-version-value'>
            {version}
        </div>
    </div>
</div>
