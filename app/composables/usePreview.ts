import { onKeyStroke } from "@vueuse/core";

export const usePreview = () => {
  const opened = useState("opened-preview", () => -1);
  const open = ref(false);
  const limit = ref(0);

  // onKeyStroke("ArrowRight", (e) => {
  //   e.preventDefault();
  //   next();
  // });

  // onKeyStroke("ArrowLeft", (e) => {
  //   e.preventDefault();
  //   prev();
  // });

  const direction = ref("right"); // Track slide direction: 'left' or 'right'
  const nextPage = () => {
    if (opened.value >= 0 && opened.value < limit.value - 1) {
      direction.value = "right";
      opened.value++;
    }
  };

  function prevPage() {
    if (opened.value > 0) {
      direction.value = "left";
      opened.value--;
    }
  }

  watch(opened, (value) => {
    if (value >= 0) {
      open.value = true;
    }
  });

  watch(open, (isOpen) => {
    if (!isOpen) {
      opened.value = -1;
    }
  });

  return {
    open,
    opened,
    limit,
    prevPage,
    nextPage,
  };
};
