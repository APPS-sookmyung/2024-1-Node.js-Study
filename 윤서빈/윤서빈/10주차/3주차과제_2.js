//사용자가 설정한 프로필 이미지
const useProfileImage = null;

//기본 프로필 이미지
const defaultProfileImage = "default.jpg";

//널 병합 연산자를 사용하여 사용자가 설정한 이미지가 없을 경우 기본 이미지를 사용
const displayImage = useProfileImage ?? defaultProfileImage;

console.log("표시할 이미지:", displayImage);