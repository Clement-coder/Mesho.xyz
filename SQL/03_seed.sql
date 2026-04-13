-- ============================================================
-- MESHO DATA SCIENCES — SEED DATA
-- Run this THIRD in Supabase SQL Editor
-- ============================================================

-- DEPARTMENTS
insert into public.departments (id, name, description, icon, color) values
  ('00000000-0000-0000-0000-000000000001', 'Accounting', 'Accounting research materials and topics', 'BookOpen', '#3b82f6'),
  ('00000000-0000-0000-0000-000000000002', 'Actuarial Science', 'Actuarial Science research materials and topics', 'BarChart3', '#10b981'),
  ('00000000-0000-0000-0000-000000000003', 'Geography Education', 'Geography Education research materials and topics', 'Globe', '#f59e0b'),
  ('00000000-0000-0000-0000-000000000004', 'Biology Education', 'Biology Education research materials and topics', 'Leaf', '#22c55e'),
  ('00000000-0000-0000-0000-000000000005', 'Mathematics Education', 'Mathematics Education research materials and topics', 'Calculator', '#8b5cf6'),
  ('00000000-0000-0000-0000-000000000006', 'Integrated Science Education', 'Integrated Science Education research materials and topics', 'FlaskConical', '#06b6d4'),
  ('00000000-0000-0000-0000-000000000007', 'CRS Education', 'Christian Religious Studies research materials and topics', 'BookMarked', '#ec4899'),
  ('00000000-0000-0000-0000-000000000008', 'Marketing', 'Marketing research materials and topics', 'TrendingUp', '#f97316'),
  ('00000000-0000-0000-0000-000000000009', 'Banking and Finance', 'Banking and Finance research materials and topics', 'Landmark', '#14b8a6'),
  ('00000000-0000-0000-0000-000000000010', 'Social Studies Education', 'Social Studies Education research materials and topics', 'Users', '#a855f7'),
  ('00000000-0000-0000-0000-000000000011', 'History & International Relations', 'History & International Relations research materials and topics', 'Globe2', '#ef4444'),
  ('00000000-0000-0000-0000-000000000012', 'Political Science', 'Political Science research materials and topics', 'Scale', '#64748b'),
  ('00000000-0000-0000-0000-000000000013', 'English Education', 'English Education research materials and topics', 'PenLine', '#0ea5e9'),
  ('00000000-0000-0000-0000-000000000014', 'Physics Education', 'Physics Education research materials and topics', 'Atom', '#d97706'),
  ('00000000-0000-0000-0000-000000000015', 'Chemistry Education', 'Chemistry Education research materials and topics', 'TestTube', '#16a34a'),
  ('00000000-0000-0000-0000-000000000016', 'Microbiology', 'Microbiology research materials and topics', 'Microscope', '#dc2626')
on conflict (id) do nothing;

-- COURSES
insert into public.courses (id, department_id, name, icon, difficulty, tools) values
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Accounting Research Materials', 'BookOpen', 'Undergraduate', array['SPSS','Excel']),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Actuarial Science Research', 'BarChart3', 'Postgraduate', array['SPSS','R']),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Geography Education Research', 'Globe', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000004', 'Biology Education Research', 'Leaf', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000005', 'Mathematics Education Research', 'Calculator', 'Undergraduate', array['SPSS','Excel']),
  ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000006', 'Integrated Science Research', 'FlaskConical', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000007', 'CRS Education Research', 'BookMarked', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000008', 'Marketing Research Materials', 'TrendingUp', 'Undergraduate', array['SPSS','Excel']),
  ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000009', 'Banking & Finance Research', 'Landmark', 'Undergraduate', array['SPSS','Excel']),
  ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000010', 'Social Studies Education Research', 'Users', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000011', 'History & Int''l Relations Research', 'Globe2', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000012', 'Political Science Research', 'Scale', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000013', '00000000-0000-0000-0000-000000000013', 'English Education Research', 'PenLine', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000014', '00000000-0000-0000-0000-000000000014', 'Physics Education Research', 'Atom', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000015', '00000000-0000-0000-0000-000000000015', 'Chemistry Education Research', 'TestTube', 'Undergraduate', array['SPSS']),
  ('00000000-0000-0000-0001-000000000016', '00000000-0000-0000-0000-000000000016', 'Microbiology Research Materials', 'Microscope', 'Undergraduate', array['SPSS'])
on conflict (id) do nothing;

-- PROJECTS
insert into public.projects (id, course_id, title, description, difficulty, price, tools, duration, learning_outcomes, locked) values
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'Effect of Internal Control on Financial Performance', 'A study on internal control systems and their impact on organizational financial performance', 'Undergraduate', 5000, array['SPSS','Excel'], 'Instant Download', array['Understand internal control frameworks','Analyze financial data','Interpret regression results'], true),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Tax Compliance and Revenue Generation in Nigeria', 'Examining the relationship between tax compliance and government revenue generation', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Analyze tax data','Understand fiscal policy','Present statistical findings'], true),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000002', 'Actuarial Valuation of Pension Funds', 'A comprehensive actuarial analysis of pension fund sustainability', 'Postgraduate', 7000, array['SPSS','R'], 'Instant Download', array['Apply actuarial models','Interpret mortality tables','Evaluate fund solvency'], true),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000003', 'Impact of Climate Change on Agricultural Output', 'Geographical study on climate variability and its effect on crop yields', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Analyze climate data','Map agricultural zones','Interpret spatial statistics'], true),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000004', 'Effect of Instructional Methods on Biology Achievement', 'Comparing teaching methods and their effect on students'' biology performance', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design quasi-experimental study','Analyze test scores','Interpret ANOVA results'], true),
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000005', 'Mathematics Anxiety and Academic Performance', 'Investigating the relationship between mathematics anxiety and student performance', 'Undergraduate', 5000, array['SPSS','Excel'], 'Instant Download', array['Administer Likert-scale surveys','Run correlation analysis','Interpret findings'], true),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000006', 'Inquiry-Based Learning in Integrated Science', 'Effect of inquiry-based teaching on integrated science achievement scores', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design experimental study','Analyze pre/post-test data','Report results'], true),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000007', 'Religious Education and Moral Development in Secondary Schools', 'Assessing the role of CRS education in shaping students'' moral values', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design survey instruments','Analyze ordinal data','Interpret chi-square results'], true),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0001-000000000008', 'Social Media Marketing and Consumer Buying Behaviour', 'Examining how social media marketing influences consumer purchase decisions', 'Undergraduate', 5000, array['SPSS','Excel'], 'Instant Download', array['Design questionnaire','Run regression analysis','Interpret marketing data'], true),
  ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0001-000000000009', 'Microfinance and SME Growth in Nigeria', 'Analyzing the impact of microfinance bank loans on small business growth', 'Undergraduate', 5000, array['SPSS','Excel'], 'Instant Download', array['Analyze financial data','Run descriptive statistics','Interpret t-test results'], true),
  ('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0001-000000000010', 'Civic Education and Youth Political Participation', 'Assessing the effect of social studies education on youth civic engagement', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design survey','Analyze Likert data','Interpret correlation'], true),
  ('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0001-000000000011', 'Colonialism and Economic Underdevelopment in Africa', 'A historical analysis of colonial policies and their long-term economic effects', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Analyze historical data','Apply dependency theory','Present findings'], true),
  ('00000000-0000-0000-0002-000000000013', '00000000-0000-0000-0001-000000000012', 'Electoral Violence and Democratic Consolidation in Nigeria', 'Examining the relationship between electoral violence and democratic stability', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Analyze election data','Run chi-square test','Interpret political findings'], true),
  ('00000000-0000-0000-0002-000000000014', '00000000-0000-0000-0001-000000000013', 'Reading Comprehension Strategies and Academic Achievement', 'Effect of reading strategies on English language comprehension scores', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design reading tests','Analyze score data','Interpret ANCOVA results'], true),
  ('00000000-0000-0000-0002-000000000015', '00000000-0000-0000-0001-000000000014', 'Problem-Based Learning and Physics Achievement', 'Comparing problem-based and lecture methods in physics education', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design experimental study','Analyze test scores','Interpret t-test'], true),
  ('00000000-0000-0000-0002-000000000016', '00000000-0000-0000-0001-000000000015', 'Cooperative Learning and Chemistry Performance', 'Effect of cooperative learning strategy on students'' chemistry achievement', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Design cooperative study','Analyze pre/post scores','Interpret ANOVA'], true),
  ('00000000-0000-0000-0002-000000000017', '00000000-0000-0000-0001-000000000016', 'Antibiotic Resistance Patterns in Clinical Isolates', 'Investigating antibiotic resistance among bacterial isolates from clinical samples', 'Undergraduate', 5000, array['SPSS'], 'Instant Download', array['Analyze microbial data','Run descriptive statistics','Interpret resistance patterns'], true)
on conflict (id) do nothing;
