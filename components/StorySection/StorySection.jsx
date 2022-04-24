import React from "react";
import styles from "./StorySection.module.css";
function StoryItem(props) {
  return (
    <div className={styles.story_item}>
      <div className={styles.story_item_avatar}>
        <div className={styles.story_item_img}>
          <img src={props.img} alt="" />
        </div>
      </div>
      <div className={styles.story_item_info}>
        <div className={styles.story_item_info_name}>{props.name}</div>
      </div>
    </div>
  );
}
function StorySection() {
  return (
    <div className={styles.story_section}>
      <div className={styles.story_section_wrapper}>
        <div className={styles.story_items}>
          <StoryItem
            img="https://randomuser.me/api/portraits/men/1.jpg"
            name="your story"
          />
          <StoryItem
            img="https://randomuser.me/api/portraits/women/95.jpg"
            name="TerryLucas"
          />
          <StoryItem
            img="https://images.unsplash.com/photo-1496081081095-d32308dd6206?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=dd302358c7e18c27c4086e97caf85781"
            name="LauraMatt"
          />
          <StoryItem
            img="https://randomuser.me/api/portraits/men/12.jpg"
            name="harryprescott"
          />
          <StoryItem
            img="https://randomuser.me/api/portraits/women/87.jpg"
            name="ednamanz"
          />
          <StoryItem
            img="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
            name="your story"
          />
          <StoryItem
            img="https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
            name="your story"
          />
        </div>
      </div>
    </div>
  );
}

export default StorySection;
