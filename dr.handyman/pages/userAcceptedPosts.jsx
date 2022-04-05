import AppLayout from "components/layout/AppLayout";
import ProfileDashboardLayout from "components/layout/ProfileDashboardLayout";
import DashboardPageHeader from "components/profile/ProfileDashboardHeader";
import ProfileDashboardNavigation from "components/profile/ProfileDashboardNav";
import UserPosts from "components/userposts/userPosts";

const UserAcceptPostPage = (props) => {
	return (
		<AppLayout>
			<ProfileDashboardLayout>
				<DashboardPageHeader
					title="My Accept Posts"
					navigation={<ProfileDashboardNavigation />}
				/>

				<UserPosts type="accept"/>
			</ProfileDashboardLayout>
		</AppLayout>
	);
};

export default UserAcceptPostPage;
